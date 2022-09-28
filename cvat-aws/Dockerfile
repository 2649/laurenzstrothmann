ARG ALPINE_VERSION=3.13
ARG AWS_CDK_VERSION=2.41.0
FROM alpine:${ALPINE_VERSION}

COPY requirements.txt requirements.txt

RUN apk -v --no-cache --update add \
        nodejs \
        npm \
        python3 \
        ca-certificates \
        groff \
        less \
        bash \
        make \
        curl \
        wget \
        zip \
        git \
        py-pip \
        && \
    update-ca-certificates && \
    npm install -g aws-cdk@${AWS_CDK_VERSION} &&\
    pip3 install -r requirements.txt


WORKDIR /opt/app

CMD ["cdk", "--version"]