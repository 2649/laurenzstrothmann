import json
from icevision.all import *
from icevision.core import class_map
import torch

# Params
image_size = 384
dest_dir = "fridge"
num_epochs = 20
dl_worker = 0

# Download the dataset
url = "https://cvbp-secondary.z19.web.core.windows.net/datasets/object_detection/odFridgeObjects.zip"
data_dir = icedata.load_data(url, dest_dir)

# Create the parser
parser = parsers.VOCBBoxParser(annotations_dir=data_dir / "odFridgeObjects/annotations", images_dir=data_dir / "odFridgeObjects/images")
# Parse annotations to create records
train_records, valid_records = parser.parse()

# Transforms
# size is set to 384 because EfficientDet requires its inputs to be divisible by 128
train_tfms = tfms.A.Adapter([*tfms.A.aug_tfms(size=image_size, presize=512), tfms.A.Normalize()])
valid_tfms = tfms.A.Adapter([*tfms.A.resize_and_pad(image_size), tfms.A.Normalize()])

# Datasets
train_ds = Dataset(train_records, train_tfms)
valid_ds = Dataset(valid_records, valid_tfms)

# Show an element of the train_ds with augmentation transformations applied
samples = [train_ds[0] for _ in range(3)]
show_samples(samples, ncols=3)

model_type = models.retinanet
backbone = model_type.backbones.resnet50_fpn(pretrained=True)

model = model_type.model(backbone=backbone(pretrained=True), num_classes=len(parser.class_map))

# Data Loaders
train_dl = model_type.train_dl(train_ds, batch_size=8, num_workers=dl_worker, shuffle=True)
valid_dl = model_type.valid_dl(valid_ds, batch_size=8, num_workers=dl_worker, shuffle=False)

# show batch
model_type.show_batch(first(valid_dl), ncols=4)

metrics = [COCOMetric(metric_type=COCOMetricType.bbox)]

# Model adapter
class LightModel(model_type.lightning.ModelAdapter):
    def configure_optimizers(self):
        return SGD(self.parameters(), lr=1e-4)
    
light_model = LightModel(model, metrics=metrics)

# Train
if torch.cuda.is_available():
    trainer = pl.Trainer(max_epochs=num_epochs, gpus=1)
else:
    trainer = pl.Trainer(max_epochs=num_epochs)

trainer.fit(light_model, train_dl, valid_dl)

# Export to ONNX
light_model.to_onnx("model.onnx", input_sample=torch.randn((1, 3, image_size, image_size)), opset_version=11)
with open("class_map.json", "w") as file:
    json.dump(parser.class_map._class2id, file)  # In icevision 0.8 the fn get_classes doe snot exist. Need to call the private fn