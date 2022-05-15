(this["webpackJsonpcv-app"]=this["webpackJsonpcv-app"]||[]).push([[0],{206:function(e,t){},208:function(e,t){},316:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),o=n(31),r=n.n(o),c=n(165),s=n(361),l=n(28),u=n(14),d=n(354),h=n(363),f=n(12),b=n(366),m=n(367),j=n(369),g=n(370),p=n(371),v=n(368),O=n(110),x=n.n(O),y=n(163),w=n.n(y),k=n(162),S=n.n(k),M=n(360),C=n(158),I=n.n(C),T=n(160),E=n.n(T),N=n(161),D=n.n(N),R=function(e,t,n,a,i){e.beginPath(),e.rect(t.box[0]*n,t.box[1]*a,t.box[2]*n,-t.box[3]*a),i===t.id&&(e.fillStyle=t.color+"4D",e.fill()),e.stroke()},A=function(e,t,n,a,i){e.beginPath(),e.moveTo(t.polygon[0][0]*n,t.polygon[0][1]*a),t.polygon.forEach((function(t,i){0===i?e.moveTo(t[0]*n,(1-t[1])*a):e.lineTo(t[0]*n,(1-t[1])*a)})),i===t.id&&(e.fillStyle=t.color+"4D",e.fill()),e.closePath(),e.stroke()},P=n(64),W=function(){return Object(P.b)()},F=P.c,J=n(82),L=function(e){localStorage.setItem("Ids",JSON.stringify(e))},z=function(e){localStorage.setItem(e.id,JSON.stringify(e))},B=Object(J.b)({name:"images",initialState:{images:function(){var e=localStorage.getItem("Ids");return null!==e?JSON.parse(e):[]}().map((function(e){return function(e){return JSON.parse(String(localStorage.getItem(e)))}(e)})).filter((function(e){return null!==e}))},reducers:{updateImage:function(e,t){e.images=e.images.map((function(e){return e.id===t.payload.id?t.payload:e})),z(t.payload)},addImage:function(e,t){e.images=[].concat(Object(f.a)(e.images),[t.payload]),z(t.payload),L(e.images.map((function(e){return e.id})))},removeImage:function(e,t){var n;e.images=Object(f.a)(e.images.filter((function(e){return e.id!==t.payload.id}))),n=t.payload.id,localStorage.removeItem(n),L(e.images.map((function(e){return e.id})))}}}),H=B.actions,U=H.addImage,Y=H.updateImage,G=H.removeImage,V=B.reducer,$=n(358),q=n(373),K=n(372),Q=n(23),X=n(24),Z=n(62),_=n(65),ee=function(e){var t=Math.max.apply(Math,Object(f.a)(e)),n=e.map((function(e){return Math.exp(e-t)})),a=n.reduce((function(e,t){return e+t}));return n.map((function(e){return e/a}))},te=function(e){return Math.exp(e)/(Math.exp(e)+1)},ne=n(36),ae=n(111),ie=n(21),oe=n.n(ie),re=n(108),ce=n(155),se=n.n(ce),le=function(e,t){var n=Math.max(e[0],t[0]),a=Math.max(e[1],t[1]),i=Math.min(e[0]+e[2],t[0]+t[2]),o=Math.min(e[1]+e[3],t[1]+t[3]);if(i<n||o<a)return 0;var r=(i-n)*(o-a);return r/(e[2]*e[3]+t[2]*t[3]-r)},ue=function(e){Object(Z.a)(n,e);var t=Object(_.a)(n);function n(e){var a;return Object(Q.a)(this,n),(a=t.call(this,e)).name="ModelStillLoading",a}return Object(X.a)(n)}(Object(ae.a)(Error)),de=function(e){Object(Z.a)(n,e);var t=Object(_.a)(n);function n(e){var a;return Object(Q.a)(this,n),(a=t.call(this,e)).name="NotImplementedError",a}return Object(X.a)(n)}(Object(ae.a)(Error)),he=function(){function e(t,n,a){Object(Q.a)(this,e),this.modelSrc=void 0,this.modelFile=void 0,this.executionProvider=void 0,this.dims=void 0,this.session=void 0,this.loaded=void 0,this.error=void 0,this.modelSrc=t,this.dims=n,this.executionProvider=a,this.modelFile=new ArrayBuffer(0),this.session=void 0,this.loaded=!1,this.error=!1}return Object(X.a)(e,[{key:"preprocess",value:function(e){throw new de("The fn preprocess needs to be implemented")}},{key:"postprocess",value:function(e,t){throw new de("The fn postprocess needs to be implemented")}},{key:"inference",value:function(){var e=Object(ne.a)(oe.a.mark((function e(t){var n,a,i,o,r,c,s,l=this;return oe.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.error=!1,void 0!==this.session){e.next=3;break}throw new ue("Model ".concat(this.modelSrc," is still loading"));case 3:return e.prev=3,e.next=6,this.loadImageToJimp(t);case 6:return a=e.sent,i=this.preprocess(a.clone()),o=this.imageToTensor(i),(r={})[this.session.inputNames[0]]=o,console.log("Loaded this feeds:"),console.log(r),e.next=15,this.session.run(r);case 15:c=e.sent,s=c[this.session.outputNames[0]],n=this.postprocess(s,a),console.log("Inference result"),console.log(n),e.next=26;break;case 22:e.prev=22,e.t0=e.catch(3),console.log(e.t0),this.error=!0;case 26:return e.abrupt("return",new Promise((function(e,t){l.error?t([]):e(n)})));case 27:case"end":return e.stop()}}),e,this,[[3,22]])})));return function(t){return e.apply(this,arguments)}}()},{key:"loadModel",value:function(){var e=Object(ne.a)(oe.a.mark((function e(){var t;return oe.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(this.modelSrc);case 2:return t=e.sent,e.next=5,t.arrayBuffer();case 5:return this.modelFile=e.sent,console.log("Loading model file:"),console.log(this.modelFile),e.next=10,re.InferenceSession.create(this.modelFile,{executionProviders:this.executionProvider,graphOptimizationLevel:"all"});case 10:this.session=e.sent;case 11:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"loadImageToJimp",value:function(){var e=Object(ne.a)(oe.a.mark((function e(t){var n;return oe.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,se.a.read(t).then((function(e){return e}));case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"imageToTensor",value:function(e){var t=function(e){for(var t=e.bitmap.data,n=new Array,a=new Array,i=new Array,o=0;o<t.length;o+=4)n.push(t[o]),a.push(t[o+1]),i.push(t[o+2]);return[n,a,i]}(e),n=Object(u.a)(t,3),a=function(e,t,n,a){var i,o=e.concat(n).concat(t),r=o.length,c=new Float32Array(a[1]*a[2]*a[3]);for(i=0;i<r;i++)c[i]=o[i];return c}(n[0],n[1],n[2],this.dims);return new re.Tensor("float32",a,this.dims)}}]),e}(),fe=n(356),be=function(e){Object(Z.a)(n,e);var t=Object(_.a)(n);function n(){var e;Object(Q.a)(this,n);return(e=t.call(this,"/laurenzstrothmann/tinyyolov2-8.onnx",[1,3,416,416],["webgl"])).classes=void 0,e.anchors=void 0,e.modelName=void 0,e.classesColor=void 0,e.modelName="Tiny Yolo V2",e.classes=["aeroplane","bicycle","bird","boat","bottle","bus","car","cat","chair","cow","diningtable","dog","horse","motorbike","person","pottedplant","sheep","sofa","train","tvmonitor"],e.classesColor=["#e6194b","#3cb44b","#ffe119","#4363d8","#f58231","#911eb4","#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff","#9a6324","#fffac8","#800000","#aaffc3","#808000","#ffd8b1","#000075","#109101","#ffffff","#000000"],e.anchors=[1.08,1.19,3.42,4.41,6.63,11.38,9.42,5.11,16.62,10.52],e}return Object(X.a)(n,[{key:"preprocess",value:function(e){return e.contain(this.dims[2],this.dims[3])}},{key:"postprocess",value:function(e,t){console.time("Postprocess time");for(var n=0,a=0,i=0,o=0,r=0,c=function(e,t){var n,a=e[0]/t[0],i=e[1]/t[1];if(a<i){var o=e[0]-a*t[1],r=Math.floor(o)%2===0?0:1;n=[0,0,Math.floor(o/2),Math.floor(o/2)+r]}else{var c=e[1]-i*t[0],s=Math.floor(c)%2===0?0:1;n=[Math.floor(c/2),Math.floor(c/2)+s,0,0]}return n}([this.dims[2],this.dims[3]],[t.getWidth(),t.getHeight()]),s=[];i<13;i++)for(a=0;a<13;a++){var l=[];for(o=0;o<125;o++)l.push(e.data[169*o+n]);for(r=0;r<5;r++){var u=l.splice(0,25),d=te(u[4]);if(d>.3){var h=ee(u.slice(5,u.length)),b=this.classes[h.indexOf(Math.max.apply(Math,Object(f.a)(h)))],m=this.classesColor[h.indexOf(Math.max.apply(Math,Object(f.a)(h)))],j=Math.exp(u[2])*this.anchors[2*r]*32,g=Math.exp(u[3])*this.anchors[2*r+1]*32,p=[(32*(te(u[0])+a)-j/2)/this.dims[2],(32*(te(u[1])+i)+g/2)/this.dims[3],j/(this.dims[2]-c[0]-c[1]),g/(this.dims[3]-c[2]-c[3])];p=[Math.min(Math.max(p[0],0),1),Math.min(Math.max(p[1],0),1),Math.min(Math.max(p[2],0),1),Math.min(Math.max(p[3],0),1)],s.push({className:b,color:m,id:Object(fe.a)(),score:d,model:this.modelName,type:"bbox",box:p})}}n++}return console.timeEnd("Postprocess time"),function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.5;return e.filter((function(a,i){return t=!0,e.forEach((function(e,i){le(a.box,e.box)>n&&a.score<e.score&&(t=!1)})),t}))}(s)}}]),n}(he),me=new be;me.loadModel();var je=n(2);function ge(e){var t=e.src,n=e.updateAnnotation,i=Object(a.useState)(!1),o=Object(u.a)(i,2),r=o[0],c=o[1],s=Object(a.useState)(!1),l=Object(u.a)(s,2),d=l[0],h=l[1],f=Object(a.useState)(null),b=Object(u.a)(f,2),m=b[0],j=b[1];return Object(je.jsxs)(K.a,{children:[Object(je.jsx)($.a,{sx:{background:d?Ie.palette.success.dark:Ie.palette.primary.main},variant:"contained",disabled:r,onClick:function(){console.log("Start inference"),c(!0);var e=new Date;me.inference(t).then((function(t){n(t),j(Math.round(((new Date).getTime()-e.getTime())/100)/10),c(!1),h(!0)})).catch((function(e){c(!1),h(!1)}))},children:m?"Inference (".concat(m," Sec)"):"Inference"}),r&&Object(je.jsx)(q.a,{})]})}function pe(e){var t=e.id,n=e.src,i=e.title,o=e.dateCreated,r=e.highlighted,c=e.annotations,s=e.width,l=e.height,d=e.showActions,h=void 0===d||d,O=e.onClick,y=W(),k=Object(a.useState)([0,0]),C=Object(u.a)(k,2),T=C[0],N=C[1],P=Object(a.useState)(null===c||void 0===c?void 0:c.map((function(e){return e.id}))),F=Object(u.a)(P,2),J=F[0],L=F[1],z=Object(a.useState)(null),B=Object(u.a)(z,2),H=B[0],U=B[1],V=Object(a.useRef)(document.createElement("canvas")),$=Object(a.useRef)(document.createElement("canvas")),q=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,s=c;a&&(s=c.filter((function(e){return e.id!==a}))),y(Y({id:t,src:n,title:i,dateCreated:o,highlighted:r,annotations:[].concat(Object(f.a)(s),Object(f.a)(e))})),L([].concat(Object(f.a)(J),Object(f.a)(e.map((function(e){return e.id})))))};return Object(a.useEffect)((function(){var e=new Image;e.onload=function(t){var n,a,i,o,r,c;(o=[(null===t||void 0===t||null===(n=t.currentTarget)||void 0===n?void 0:n.width)*(.6*l/(null===t||void 0===t||null===(a=t.currentTarget)||void 0===a?void 0:a.height)),.6*l])[0]>s&&(o=[s,(null===t||void 0===t||null===(r=t.currentTarget)||void 0===r?void 0:r.height)*(s/(null===t||void 0===t||null===(c=t.currentTarget)||void 0===c?void 0:c.width))]);N(o),null===$||void 0===$||null===(i=$.current.getContext("2d"))||void 0===i||i.drawImage(e,0,0,o[0],o[1])},e.src=n}),[l,s,n]),Object(a.useEffect)((function(){0!==T[0]&&null!==V&&function(e,t,n,a,i,o){var r,c=null===(r=t.current)||void 0===r?void 0:r.getContext("2d");c&&(c.clearRect(0,0,n,a),c.lineWidth=2,e.forEach((function(e){o.includes(e.id)&&(c.strokeStyle=e.color,"bbox"===e.type&&R(c,e,n,a,i),"polygon"===e.type&&A(c,e,n,a,i))})))}(c,V,T[0],T[1],H,J)}),[c,T,J,H]),Object(je.jsxs)(b.a,{sx:{margin:"auto",marginTop:3},children:[Object(je.jsx)(m.a,{sx:{background:Ie.palette.secondary.main},action:Object(je.jsx)(v.a,{"aria-label":"settings",onClick:function(){console.log("".concat(t," is deleted")),y(G({id:t}))},children:Object(je.jsx)(x.a,{})}),title:i,subheader:new Date(o).toDateString()}),Object(je.jsx)(j.a,{children:Object(je.jsxs)("div",{style:{width:T[0],height:T[1],position:"relative",marginRight:"auto",marginLeft:"auto",cursor:"pointer"},onClick:O,children:[Object(je.jsx)("canvas",{ref:$,width:T[0],height:T[1],style:{position:"absolute"}}),Object(je.jsx)("canvas",{ref:V,style:{position:"absolute"},width:T[0],height:T[1]})]})}),Object(je.jsx)(g.a,{sx:{background:Ie.palette.background.paper,flexWrap:"wrap",overflow:"auto",width:T[0]},children:function(e){return null===e||void 0===e?void 0:e.map((function(e){return Object(je.jsx)(M.a,{label:e.className,icon:"bbox"===e.type?Object(je.jsx)(I.a,{}):"polygon"===e.type?Object(je.jsx)(E.a,{}):Object(je.jsx)(D.a,{}),sx:{marginLeft:"5px",marginRight:"5px",backgroundColor:J.includes(e.id)?e.color:null},variant:J.includes(e.id)?"filled":"outlined",onClick:function(){null!==J&&void 0!==J&&J.includes(e.id)?L(J.filter((function(t){return e.id!==t}))):L([].concat(Object(f.a)(J),[e.id]))},onDelete:function(){return q([],e.id)},deleteIcon:Object(je.jsx)(x.a,{}),onMouseOver:function(){U(e.id)},onMouseOut:function(){U(null)}},e.id)}))}(c)}),h&&Object(je.jsxs)(p.a,{disableSpacing:!0,sx:{position:"relative",background:Ie.palette.secondary.main},children:[Object(je.jsx)(v.a,{"aria-label":"add to favorites",sx:{marginRight:"auto"},onClick:function(){y(Y({id:t,src:n,title:i,dateCreated:o,highlighted:!r,annotations:c}))},children:r?Object(je.jsx)(S.a,{}):Object(je.jsx)(w.a,{})}),Object(je.jsx)(ge,{src:n,updateAnnotation:q})]})]})}function ve(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],i=t[1],o=F((function(e){return e.images.images}));return Object(je.jsxs)(je.Fragment,{children:[Object(je.jsx)("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",justifyItems:"center",alignContent:"center"},children:o.map((function(e){var t=Object(l.a)(Object(l.a)({},e),{},{width:.5*window.innerWidth,height:.5*window.innerHeight,onClick:function(){i(e.id)}});return Object(a.createElement)(pe,Object(l.a)(Object(l.a)({},t),{},{key:"".concat(t.id,"-image-card-in-list")}))}))}),Object(je.jsx)(d.a,{open:null!==n,onClose:function(){return i(null)},children:Object(je.jsx)(h.a,{children:null!==n&&o.filter((function(e){return e.id===n})).map((function(e){return Object(a.createElement)(pe,Object(l.a)(Object(l.a)({},Object(l.a)(Object(l.a)({},e),{},{width:.8*window.innerWidth,height:.8*window.innerHeight})),{},{key:"".concat(e.id,"-modal-card")}))}))})})]})}var Oe=n(364),xe=n(362);function ye(){return Object(je.jsx)(Oe.a,{sx:{position:"sticky",bottom:"auto",top:0,padding:2,background:Ie.palette.secondary.main},children:Object(je.jsx)(xe.a,{variant:"h5",component:"div",sx:{flexGrow:1},children:"Welcome!"})})}var we=n(365),ke=n(164),Se=n.n(ke),Me=n(359);function Ce(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],i=t[1],o=Object(a.useState)(null),r=Object(u.a)(o,2),c=r[0],s=r[1],l=Object(a.useState)(null),h=Object(u.a)(l,2),f=h[0],b=h[1],m=Object(a.useRef)(null),j=W(),g=function(){s(null),i(null)};return Object(je.jsxs)(je.Fragment,{children:[Object(je.jsx)(we.a,{sx:{position:"fixed",bottom:16,right:16},onClick:function(){null!==m.current&&m.current.click()},children:Object(je.jsx)(Se.a,{})}),Object(je.jsx)(d.a,{open:null!==n,onClose:g,children:Object(je.jsxs)(Me.a,{container:!0,spacing:2,children:[Object(je.jsx)(Me.a,{item:!0,xs:12,children:Object(je.jsx)(pe,{id:Object(fe.a)(),src:null!==n?n:"",annotations:[],width:.8*window.innerWidth,height:.8*window.innerHeight,title:c||"Your new image",dateCreated:String(f),highlighted:!1,showActions:!1})}),Object(je.jsx)(Me.a,{item:!0,xs:6,sx:{padding:0,display:"flex",justifyContent:"center",alignItems:"center"},children:Object(je.jsx)($.a,{variant:"contained",size:"large",onClick:g,children:"Discard"})}),Object(je.jsx)(Me.a,{item:!0,xs:6,sx:{display:"flex",justifyContent:"center",alignItems:"center"},children:Object(je.jsx)($.a,{variant:"contained",size:"large",onClick:function(){var e={id:Object(fe.a)(),src:String(n),title:String(c),dateCreated:String(f),highlighted:!1,annotations:[]};j(U(e)),g()},children:"Save"})})]})}),Object(je.jsx)("input",{ref:m,type:"file",style:{display:"none"},accept:"image/*",onChange:function(e){if(null!==e.currentTarget.files){var t=new FileReader;t.onload=function(e){var t;!function(e){if(e.length>1e6){var t=1e6/e.length;console.log("Rescale ratio: ".concat(t));var n=new Image;n.onload=function(){var e=[Math.floor(n.width*t),Math.floor(n.height*t)],a=document.createElement("canvas");a.width=e[0],a.height=e[1];var o=a.getContext("2d");null===o||void 0===o||o.drawImage(n,0,0,e[0],e[1]),i(a.toDataURL("image/jpeg",1))},n.src=e}else i(e)}(String(null===(t=e.target)||void 0===t?void 0:t.result))},s(null===e||void 0===e?void 0:e.currentTarget.files[0].name),b(String(new Date)),t.readAsDataURL(e.currentTarget.files[0])}}})]})}var Ie=Object(c.a)({palette:{mode:"dark",primary:{main:"#8a43c1"},secondary:{main:"#375ee8"},background:{default:"#353434",paper:"#525252"}},spacing:8});var Te=function(){return Object(je.jsxs)(s.a,{theme:Ie,children:[Object(je.jsx)(ye,{}),Object(je.jsx)(ve,{}),Object(je.jsx)(Ce,{})]})},Ee=Object(J.a)({reducer:{images:V}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(Object(je.jsx)(i.a.StrictMode,{children:Object(je.jsx)(P.a,{store:Ee,children:Object(je.jsx)(Te,{})})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[316,1,2]]]);
//# sourceMappingURL=main.a6c678bd.chunk.js.map