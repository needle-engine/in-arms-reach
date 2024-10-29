import{a as V,M as ft,i as It,T as wt,b as At,g as Tt,c as _t,B as L,I as Mt,C as Dt,O as St,R as Bt,S as Et,d as Ft}from"./MeshBVH-6ccb27b9.js";import{A as Te,e as _e,j as Me,E as De,h as Se,N as Be,l as Ee,f as Fe,k as Ne}from"./MeshBVH-6ccb27b9.js";import{q as Nt,L as zt,a as kt,O as Ct,B as z,r as S,t as U,V as w,f as Pt,u as Ht,d as q,v as G,N as D,w as k,I as O,F as C,x as $,y as Rt,z as J,H as Ot,J as W,K as Y,X as Vt,Y as Wt,Z as ht,_ as Ut,$ as qt,a0 as K}from"./index-bb027484.js";const Q=new U;class Lt extends Ct{get isMesh(){return!this.displayEdges}get isLineSegments(){return this.displayEdges}get isLine(){return this.displayEdges}constructor(t,e,n=10,o=0){super(),this.material=e,this.geometry=new z,this.name="MeshBVHRootHelper",this.depth=n,this.displayParents=!1,this.bvh=t,this.displayEdges=!0,this._group=o}raycast(){}update(){const t=this.geometry,e=this.bvh,n=this._group;if(t.dispose(),this.visible=!1,e){const o=this.depth-1,s=this.displayParents;let r=0;e.traverse((h,d)=>{if(h>=o||d)return r++,!0;s&&r++},n);let a=0;const c=new Float32Array(8*3*r);e.traverse((h,d,p)=>{const m=h>=o||d;if(m||s){V(0,p,Q);const{min:b,max:y}=Q;for(let x=-1;x<=1;x+=2){const v=x<0?b.x:y.x;for(let B=-1;B<=1;B+=2){const g=B<0?b.y:y.y;for(let I=-1;I<=1;I+=2){const gt=I<0?b.z:y.z;c[a+0]=v,c[a+1]=g,c[a+2]=gt,a+=3}}}return m}},n);let l,u;this.displayEdges?u=new Uint8Array([0,4,1,5,2,6,3,7,0,2,1,3,4,6,5,7,0,1,2,3,4,5,6,7]):u=new Uint8Array([0,1,2,2,1,3,4,6,5,6,7,5,1,4,5,0,4,1,2,3,6,3,7,6,0,2,4,2,6,4,1,5,3,3,5,7]),c.length>65535?l=new Uint32Array(u.length*r):l=new Uint16Array(u.length*r);const f=u.length;for(let h=0;h<r;h++){const d=h*8,p=h*f;for(let m=0;m<f;m++)l[p+m]=d+u[m]}t.setIndex(new S(l,1,!1)),t.setAttribute("position",new S(c,3,!1)),this.visible=!0}}}class pt extends Nt{get color(){return this.edgeMaterial.color}get opacity(){return this.edgeMaterial.opacity}set opacity(t){this.edgeMaterial.opacity=t,this.meshMaterial.opacity=t}constructor(t=null,e=null,n=10){t instanceof ft&&(n=e||10,e=t,t=null),typeof e=="number"&&(n=e,e=null),super(),this.name="MeshBVHHelper",this.depth=n,this.mesh=t,this.bvh=e,this.displayParents=!1,this.displayEdges=!0,this._roots=[];const o=new zt({color:65416,transparent:!0,opacity:.3,depthWrite:!1}),s=new kt({color:65416,transparent:!0,opacity:.3,depthWrite:!1});s.color=o.color,this.edgeMaterial=o,this.meshMaterial=s,this.update()}update(){const t=this.bvh||this.mesh.geometry.boundsTree,e=t?t._roots.length:0;for(;this._roots.length>e;){const n=this._roots.pop();n.geometry.dispose(),this.remove(n)}for(let n=0;n<e;n++){const{depth:o,edgeMaterial:s,meshMaterial:r,displayParents:a,displayEdges:c}=this;if(n>=this._roots.length){const u=new Lt(t,s,o,n);this.add(u),this._roots.push(u)}const l=this._roots[n];l.bvh=t,l.depth=o,l.displayParents=a,l.displayEdges=c,l.material=c?s:r,l.update()}}updateMatrixWorld(...t){const e=this.mesh,n=this.parent;e!==null&&(e.updateWorldMatrix(!0,!1),n?this.matrix.copy(n.matrixWorld).invert().multiply(e.matrixWorld):this.matrix.copy(e.matrixWorld),this.matrix.decompose(this.position,this.quaternion,this.scale)),super.updateMatrixWorld(...t)}copy(t){this.depth=t.depth,this.mesh=t.mesh,this.bvh=t.bvh,this.opacity=t.opacity,this.color.copy(t.color)}clone(){return new pt(this.mesh,this.bvh,this.depth)}dispose(){this.edgeMaterial.dispose(),this.meshMaterial.dispose();const t=this.children;for(let e=0,n=t.length;e<n;e++)t[e].geometry.dispose()}}const E=new U,tt=new U,M=new w;function et(i){switch(typeof i){case"number":return 8;case"string":return i.length*2;case"boolean":return 4;default:return 0}}function Xt(i){return/(Uint|Int|Float)(8|16|32)Array/.test(i.constructor.name)}function jt(i,t){const e={nodeCount:0,leafNodeCount:0,depth:{min:1/0,max:-1/0},tris:{min:1/0,max:-1/0},splits:[0,0,0],surfaceAreaScore:0};return i.traverse((n,o,s,r,a)=>{const c=s[3]-s[0],l=s[1+3]-s[1],u=s[2+3]-s[2],f=2*(c*l+l*u+u*c);e.nodeCount++,o?(e.leafNodeCount++,e.depth.min=Math.min(n,e.depth.min),e.depth.max=Math.max(n,e.depth.max),e.tris.min=Math.min(a,e.tris.min),e.tris.max=Math.max(a,e.tris.max),e.surfaceAreaScore+=f*wt*a):(e.splits[r]++,e.surfaceAreaScore+=f*At)},t),e.tris.min===1/0&&(e.tris.min=0,e.tris.max=0),e.depth.min===1/0&&(e.depth.min=0,e.depth.max=0),e}function ce(i){return i._roots.map((t,e)=>jt(i,e))}function le(i){const t=new Set,e=[i];let n=0;for(;e.length;){const o=e.pop();if(!t.has(o)){t.add(o);for(let s in o){if(!Object.hasOwn(o,s))continue;n+=et(s);const r=o[s];r&&(typeof r=="object"||typeof r=="function")?Xt(r)||It()&&r instanceof SharedArrayBuffer||r instanceof ArrayBuffer?n+=r.byteLength:e.push(r):n+=et(r)}}}return n}function de(i){const t=i.geometry,e=[],n=t.index,o=t.getAttribute("position");let s=!0;return i.traverse((r,a,c,l,u)=>{const f={depth:r,isLeaf:a,boundingData:c,offset:l,count:u};e[r]=f,V(0,c,E);const h=e[r-1];if(a)for(let d=l,p=l+u;d<p;d++){const m=i.resolveTriangleIndex(d);let b=3*m,y=3*m+1,x=3*m+2;n&&(b=n.getX(b),y=n.getX(y),x=n.getX(x));let v;M.fromBufferAttribute(o,b),v=E.containsPoint(M),M.fromBufferAttribute(o,y),v=v&&E.containsPoint(M),M.fromBufferAttribute(o,x),v=v&&E.containsPoint(M),console.assert(v,"Leaf bounds does not fully contain triangle."),s=s&&v}if(h){V(0,c,tt);const d=tt.containsBox(E);console.assert(d,"Parent bounds does not fully contain child."),s=s&&d}}),s}function ue(i){const t=[];return i.traverse((e,n,o,s,r)=>{const a={bounds:V(0,o,new U)};n?(a.count=r,a.offset=s):(a.left=null,a.right=null),t[e]=a;const c=t[e-1];c&&(c.left===null?c.left=a:c.right=a)}),t[0]}function nt(i,t,e){return i===null?null:(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i)}const P=new Ht,it=new w,ot=new q,Gt=Pt.prototype.raycast,st=new w;function fe(i,t){if(this.geometry.boundsTree){if(this.material===void 0)return;ot.copy(this.matrixWorld).invert(),P.copy(i.ray).applyMatrix4(ot),Yt(this.matrixWorld,st),it.copy(P.direction).multiply(st);const e=it.length(),n=i.near/e,o=i.far/e,s=this.geometry.boundsTree;if(i.firstHitOnly===!0){const r=nt(s.raycastFirst(P,this.material,n,o),this,i);r&&t.push(r)}else{const r=s.raycast(P,this.material,n,o);for(let a=0,c=r.length;a<c;a++){const l=nt(r[a],this,i);l&&t.push(l)}}}else Gt.call(this,i,t)}function he(i){return this.boundsTree=new ft(this,i),this.boundsTree}function pe(){this.boundsTree=null}function Yt(i,t){const e=i.elements,n=t.set(e[0],e[1],e[2]).length(),o=t.set(e[4],e[5],e[6]).length(),s=t.set(e[8],e[9],e[10]).length();return t.set(n,o,s)}function Kt(i){switch(i){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw new Error}function Zt(i){switch(i){case 1:return Wt;case 2:return Vt;case 3:return W;case 4:return W}}function rt(i){switch(i){case 1:return Ut;case 2:return ht;case 3:return Y;case 4:return Y}}class Z extends G{constructor(){super(),this.minFilter=D,this.magFilter=D,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(t){const e=this.overrideItemSize,n=t.itemSize,o=t.count;if(e!==null){if(n*o%e!==0)throw new Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");t.itemSize=e,t.count=o*n/e}const s=t.itemSize,r=t.count,a=t.normalized,c=t.array.constructor,l=c.BYTES_PER_ELEMENT;let u=this._forcedType,f=s;if(u===null)switch(c){case Float32Array:u=C;break;case Uint8Array:case Uint16Array:case Uint32Array:u=k;break;case Int8Array:case Int16Array:case Int32Array:u=O;break}let h,d,p,m,b=Kt(s);switch(u){case C:p=1,d=Zt(s),a&&l===1?(m=c,b+="8",c===Uint8Array?h=$:(h=J,b+="_SNORM")):(m=Float32Array,b+="32F",h=C);break;case O:b+=l*8+"I",p=a?Math.pow(2,c.BYTES_PER_ELEMENT*8-1):1,d=rt(s),l===1?(m=Int8Array,h=J):l===2?(m=Int16Array,h=Ot):(m=Int32Array,h=O);break;case k:b+=l*8+"UI",p=a?Math.pow(2,c.BYTES_PER_ELEMENT*8-1):1,d=rt(s),l===1?(m=Uint8Array,h=$):l===2?(m=Uint16Array,h=Rt):(m=Uint32Array,h=k);break}f===3&&(d===W||d===Y)&&(f=4);const y=Math.ceil(Math.sqrt(r))||1,x=f*y*y,v=new m(x),B=t.normalized;t.normalized=!1;for(let g=0;g<r;g++){const I=f*g;v[I]=t.getX(g)/p,s>=2&&(v[I+1]=t.getY(g)/p),s>=3&&(v[I+2]=t.getZ(g)/p,f===4&&(v[I+3]=1)),s>=4&&(v[I+3]=t.getW(g)/p)}t.normalized=B,this.internalFormat=b,this.format=d,this.type=h,this.image.width=y,this.image.height=y,this.image.data=v,this.needsUpdate=!0,this.dispose(),t.itemSize=n,t.count=o}}class $t extends Z{constructor(){super(),this._forcedType=k}}class me extends Z{constructor(){super(),this._forcedType=O}}class Jt extends Z{constructor(){super(),this._forcedType=C}}class ve{constructor(){this.index=new $t,this.position=new Jt,this.bvhBounds=new G,this.bvhContents=new G,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(t){const{geometry:e}=t;if(te(t,this.bvhBounds,this.bvhContents),this.position.updateFrom(e.attributes.position),t.indirect){const n=t._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==n.length)if(e.index)this._cachedIndexAttr=e.index.clone();else{const o=Tt(_t(e));this._cachedIndexAttr=new S(o,1,!1)}Qt(e,n,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(e.index)}dispose(){const{index:t,position:e,bvhBounds:n,bvhContents:o}=this;t&&t.dispose(),e&&e.dispose(),n&&n.dispose(),o&&o.dispose()}}function Qt(i,t,e){const n=e.array,o=i.index?i.index.array:null;for(let s=0,r=t.length;s<r;s++){const a=3*s,c=3*t[s];for(let l=0;l<3;l++)n[a+l]=o?o[c+l]:c+l}}function te(i,t,e){const n=i._roots;if(n.length!==1)throw new Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");const o=n[0],s=new Uint16Array(o),r=new Uint32Array(o),a=new Float32Array(o),c=o.byteLength/L,l=2*Math.ceil(Math.sqrt(c/2)),u=new Float32Array(4*l*l),f=Math.ceil(Math.sqrt(c)),h=new Uint32Array(2*f*f);for(let d=0;d<c;d++){const p=d*L/4,m=p*2,b=Ft(p);for(let y=0;y<3;y++)u[8*d+0+y]=a[b+0+y],u[8*d+4+y]=a[b+3+y];if(Mt(m,s)){const y=Dt(m,s),x=St(p,r),v=4294901760|y;h[d*2+0]=v,h[d*2+1]=x}else{const y=4*Bt(p,r)/L,x=Et(p,r);h[d*2+0]=x,h[d*2+1]=y}}t.image.data=u,t.image.width=l,t.image.height=l,t.format=W,t.type=C,t.internalFormat="RGBA32F",t.minFilter=D,t.magFilter=D,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose(),e.image.data=h,e.image.width=f,e.image.height=f,e.format=ht,e.type=k,e.internalFormat="RG32UI",e.minFilter=D,e.magFilter=D,e.generateMipmaps=!1,e.needsUpdate=!0,e.dispose()}const A=new w,T=new w,_=new w,at=new K,H=new w,X=new w,ct=new K,lt=new K,R=new q,dt=new q;function F(i,t){if(!i&&!t)return;const e=i.count===t.count,n=i.normalized===t.normalized,o=i.array.constructor===t.array.constructor,s=i.itemSize===t.itemSize;if(!e||!n||!o||!s)throw new Error}function N(i,t=null){const e=i.array.constructor,n=i.normalized,o=i.itemSize,s=t===null?i.count:t;return new S(new e(o*s),o,n)}function mt(i,t,e=0){if(i.isInterleavedBufferAttribute){const n=i.itemSize;for(let o=0,s=i.count;o<s;o++){const r=o+e;t.setX(r,i.getX(o)),n>=2&&t.setY(r,i.getY(o)),n>=3&&t.setZ(r,i.getZ(o)),n>=4&&t.setW(r,i.getW(o))}}else{const n=t.array,o=n.constructor,s=n.BYTES_PER_ELEMENT*i.itemSize*e;new o(n.buffer,s,i.array.length).set(i.array)}}function ee(i,t,e){const n=i.elements,o=t.elements;for(let s=0,r=o.length;s<r;s++)n[s]+=o[s]*e}function ut(i,t,e){const n=i.skeleton,o=i.geometry,s=n.bones,r=n.boneInverses;ct.fromBufferAttribute(o.attributes.skinIndex,t),lt.fromBufferAttribute(o.attributes.skinWeight,t),R.elements.fill(0);for(let a=0;a<4;a++){const c=lt.getComponent(a);if(c!==0){const l=ct.getComponent(a);dt.multiplyMatrices(s[l].matrixWorld,r[l]),ee(R,dt,c)}}return R.multiply(i.bindMatrix).premultiply(i.bindMatrixInverse),e.transformDirection(R),e}function j(i,t,e,n,o){H.set(0,0,0);for(let s=0,r=i.length;s<r;s++){const a=t[s],c=i[s];a!==0&&(X.fromBufferAttribute(c,n),e?H.addScaledVector(X,a):H.addScaledVector(X.sub(o),a))}o.add(H)}function ne(i,t={useGroups:!1,updateIndex:!1,skipAttributes:[]},e=new z){const n=i[0].index!==null,{useGroups:o=!1,updateIndex:s=!1,skipAttributes:r=[]}=t,a=new Set(Object.keys(i[0].attributes)),c={};let l=0;e.clearGroups();for(let u=0;u<i.length;++u){const f=i[u];let h=0;if(n!==(f.index!==null))throw new Error("StaticGeometryGenerator: All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");for(const d in f.attributes){if(!a.has(d))throw new Error('StaticGeometryGenerator: All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.');c[d]===void 0&&(c[d]=[]),c[d].push(f.attributes[d]),h++}if(h!==a.size)throw new Error("StaticGeometryGenerator: Make sure all geometries have the same number of attributes.");if(o){let d;if(n)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else throw new Error("StaticGeometryGenerator: The geometry must have either an index or a position attribute");e.addGroup(l,d,u),l+=d}}if(n){let u=!1;if(!e.index){let f=0;for(let h=0;h<i.length;++h)f+=i[h].index.count;e.setIndex(new S(new Uint32Array(f),1,!1)),u=!0}if(s||u){const f=e.index;let h=0,d=0;for(let p=0;p<i.length;++p){const m=i[p],b=m.index;if(r[p]!==!0)for(let y=0;y<b.count;++y)f.setX(h,b.getX(y)+d),h++;d+=m.attributes.position.count}}}for(const u in c){const f=c[u];if(!(u in e.attributes)){let p=0;for(const m in f)p+=f[m].count;e.setAttribute(u,N(c[u][0],p))}const h=e.attributes[u];let d=0;for(let p=0,m=f.length;p<m;p++){const b=f[p];r[p]!==!0&&mt(b,h,d),d+=b.count}}return e}function ie(i,t){if(i===null||t===null)return i===t;if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function oe(i){const{index:t,attributes:e}=i;if(t)for(let n=0,o=t.count;n<o;n+=3){const s=t.getX(n),r=t.getX(n+2);t.setX(n,r),t.setX(n+2,s)}else for(const n in e){const o=e[n],s=o.itemSize;for(let r=0,a=o.count;r<a;r+=3)for(let c=0;c<s;c++){const l=o.getComponent(r,c),u=o.getComponent(r+2,c);o.setComponent(r,c,u),o.setComponent(r+2,c,l)}}return i}class se{constructor(t){this.matrixWorld=new q,this.geometryHash=null,this.boneMatrices=null,this.primitiveCount=-1,this.mesh=t,this.update()}update(){const t=this.mesh,e=t.geometry,n=t.skeleton,o=(e.index?e.index.count:e.attributes.position.count)/3;if(this.matrixWorld.copy(t.matrixWorld),this.geometryHash=e.attributes.position.version,this.primitiveCount=o,n){n.boneTexture||n.computeBoneTexture(),n.update();const s=n.boneMatrices;!this.boneMatrices||this.boneMatrices.length!==s.length?this.boneMatrices=s.slice():this.boneMatrices.set(s)}else this.boneMatrices=null}didChange(){const t=this.mesh,e=t.geometry,n=(e.index?e.index.count:e.attributes.position.count)/3;return!(this.matrixWorld.equals(t.matrixWorld)&&this.geometryHash===e.attributes.position.version&&ie(t.skeleton&&t.skeleton.boneMatrices||null,this.boneMatrices)&&this.primitiveCount===n)}}class xe{constructor(t){Array.isArray(t)||(t=[t]);const e=[];t.forEach(n=>{n.traverseVisible(o=>{o.isMesh&&e.push(o)})}),this.meshes=e,this.useGroups=!0,this.applyWorldTransforms=!0,this.attributes=["position","normal","color","tangent","uv","uv2"],this._intermediateGeometry=new Array(e.length).fill().map(()=>new z),this._diffMap=new WeakMap}getMaterials(){const t=[];return this.meshes.forEach(e=>{Array.isArray(e.material)?t.push(...e.material):t.push(e.material)}),t}generate(t=new z){let e=[];const{meshes:n,useGroups:o,_intermediateGeometry:s,_diffMap:r}=this;for(let a=0,c=n.length;a<c;a++){const l=n[a],u=s[a],f=r.get(l);!f||f.didChange(l)?(this._convertToStaticGeometry(l,u),e.push(!1),f?f.update():r.set(l,new se(l))):e.push(!0)}if(s.length===0){t.setIndex(null);const a=t.attributes;for(const c in a)t.deleteAttribute(c);for(const c in this.attributes)t.setAttribute(this.attributes[c],new S(new Float32Array(0),4,!1))}else ne(s,{useGroups:o,skipAttributes:e},t);for(const a in t.attributes)t.attributes[a].needsUpdate=!0;return t}_convertToStaticGeometry(t,e=new z){const n=t.geometry,o=this.applyWorldTransforms,s=this.attributes.includes("normal"),r=this.attributes.includes("tangent"),a=n.attributes,c=e.attributes;!e.index&&n.index&&(e.index=n.index.clone()),c.position||e.setAttribute("position",N(a.position)),s&&!c.normal&&a.normal&&e.setAttribute("normal",N(a.normal)),r&&!c.tangent&&a.tangent&&e.setAttribute("tangent",N(a.tangent)),F(n.index,e.index),F(a.position,c.position),s&&F(a.normal,c.normal),r&&F(a.tangent,c.tangent);const l=a.position,u=s?a.normal:null,f=r?a.tangent:null,h=n.morphAttributes.position,d=n.morphAttributes.normal,p=n.morphAttributes.tangent,m=n.morphTargetsRelative,b=t.morphTargetInfluences,y=new qt;y.getNormalMatrix(t.matrixWorld),n.index&&e.index.array.set(n.index.array);for(let x=0,v=a.position.count;x<v;x++)A.fromBufferAttribute(l,x),u&&T.fromBufferAttribute(u,x),f&&(at.fromBufferAttribute(f,x),_.fromBufferAttribute(f,x)),b&&(h&&j(h,b,m,x,A),d&&j(d,b,m,x,T),p&&j(p,b,m,x,_)),t.isSkinnedMesh&&(t.applyBoneTransform(x,A),u&&ut(t,x,T),f&&ut(t,x,_)),o&&A.applyMatrix4(t.matrixWorld),c.position.setXYZ(x,A.x,A.y,A.z),u&&(o&&T.applyNormalMatrix(y),c.normal.setXYZ(x,T.x,T.y,T.z)),f&&(o&&_.transformDirection(t.matrixWorld),c.tangent.setXYZW(x,_.x,_.y,_.z,at.w));for(const x in this.attributes){const v=this.attributes[x];v==="position"||v==="tangent"||v==="normal"||!(v in a)||(c[v]||e.setAttribute(v,N(a[v])),F(a[v],c[v]),mt(a[v],c[v]))}return t.matrixWorld.determinant()<0&&oe(e),e}}const vt=`

// A stack of uint32 indices can can store the indices for
// a perfectly balanced tree with a depth up to 31. Lower stack
// depth gets higher performance.
//
// However not all trees are balanced. Best value to set this to
// is the trees max depth.
#ifndef BVH_STACK_DEPTH
#define BVH_STACK_DEPTH 60
#endif

#ifndef INFINITY
#define INFINITY 1e20
#endif

// Utilities
uvec4 uTexelFetch1D( usampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

ivec4 iTexelFetch1D( isampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 texelFetch1D( sampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {

	return
		barycoord.x * texelFetch1D( tex, faceIndices.x ) +
		barycoord.y * texelFetch1D( tex, faceIndices.y ) +
		barycoord.z * texelFetch1D( tex, faceIndices.z );

}

void ndcToCameraRay(
	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,
	out vec3 rayOrigin, out vec3 rayDirection
) {

	// get camera look direction and near plane for camera clipping
	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );
	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );
	float near = abs( nearVector.z / nearVector.w );

	// get the camera direction and position from camera matrices
	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );
	direction /= direction.w;
	direction = cameraWorld * direction - origin;

	// slide the origin along the ray until it sits at the near clip plane position
	origin.xyz += direction.xyz * near / dot( direction, lookDirection );

	rayOrigin = origin.xyz;
	rayDirection = direction.xyz;

}
`,xt=`

float dot2( vec3 v ) {

	return dot( v, v );

}

// https://www.shadertoy.com/view/ttfGWl
vec3 closestPointToTriangle( vec3 p, vec3 v0, vec3 v1, vec3 v2, out vec3 barycoord ) {

    vec3 v10 = v1 - v0;
    vec3 v21 = v2 - v1;
    vec3 v02 = v0 - v2;

	vec3 p0 = p - v0;
	vec3 p1 = p - v1;
	vec3 p2 = p - v2;

    vec3 nor = cross( v10, v02 );

    // method 2, in barycentric space
    vec3  q = cross( nor, p0 );
    float d = 1.0 / dot2( nor );
    float u = d * dot( q, v02 );
    float v = d * dot( q, v10 );
    float w = 1.0 - u - v;

	if( u < 0.0 ) {

		w = clamp( dot( p2, v02 ) / dot2( v02 ), 0.0, 1.0 );
		u = 0.0;
		v = 1.0 - w;

	} else if( v < 0.0 ) {

		u = clamp( dot( p0, v10 ) / dot2( v10 ), 0.0, 1.0 );
		v = 0.0;
		w = 1.0 - u;

	} else if( w < 0.0 ) {

		v = clamp( dot( p1, v21 ) / dot2( v21 ), 0.0, 1.0 );
		w = 0.0;
		u = 1.0-v;

	}

	barycoord = vec3( u, v, w );
    return u * v1 + v * v2 + w * v0;

}

float distanceToTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// point and cut off range
	vec3 point, float closestDistanceSquared,

	// outputs
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord, inout float side, inout vec3 outPoint
) {

	bool found = false;
	vec3 localBarycoord;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		// get the closest point and barycoord
		vec3 closestPoint = closestPointToTriangle( point, a, b, c, localBarycoord );
		vec3 delta = point - closestPoint;
		float sqDist = dot2( delta );
		if ( sqDist < closestDistanceSquared ) {

			// set the output results
			closestDistanceSquared = sqDist;
			faceIndices = uvec4( indices.xyz, i );
			faceNormal = normalize( cross( a - b, b - c ) );
			barycoord = localBarycoord;
			outPoint = closestPoint;
			side = sign( dot( faceNormal, delta ) );

		}

	}

	return closestDistanceSquared;

}

float distanceSqToBounds( vec3 point, vec3 boundsMin, vec3 boundsMax ) {

	vec3 clampedPoint = clamp( point, boundsMin, boundsMax );
	vec3 delta = point - clampedPoint;
	return dot( delta, delta );

}

float distanceSqToBVHNodeBoundsPoint( vec3 point, sampler2D bvhBounds, uint currNodeIndex ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return distanceSqToBounds( point, boundsMin, boundsMax );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhClosestPointToPoint(		bvh,		point, faceIndices, faceNormal, barycoord, side, outPoint	)	_bvhClosestPointToPoint(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		point, faceIndices, faceNormal, barycoord, side, outPoint	)

float _bvhClosestPointToPoint(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// point to check
	vec3 point,

	// output variables
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout vec3 outPoint
 ) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float closestDistanceSquared = pow( 100000.0, 2.0 );
	bool found = false;
	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// check if we intersect the current bounds
		float boundsHitDistance = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, currNodeIndex );
		if ( boundsHitDistance > closestDistanceSquared ) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );
		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;
			closestDistanceSquared = distanceToTriangles(
				bvh_position, bvh_index, offset, count, point, closestDistanceSquared,

				// outputs
				faceIndices, faceNormal, barycoord, side, outPoint
			);

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = boundsInfo.y;
			bool leftToRight = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, leftIndex ) < distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, rightIndex );//rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			ptr ++;
			stack[ ptr ] = c2;
			ptr ++;
			stack[ ptr ] = c1;

		}

	}

	return sqrt( closestDistanceSquared );

}
`,yt=`

#ifndef TRI_INTERSECT_EPSILON
#define TRI_INTERSECT_EPSILON 1e-5
#endif

// Raycasting
bool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {

	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/
	// https://tavianator.com/2011/ray_box.html
	vec3 invDir = 1.0 / rayDirection;

	// find intersection distances for each plane
	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );
	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );

	// get the min and max distances from each intersection
	vec3 tMinHit = min( tMaxPlane, tMinPlane );
	vec3 tMaxHit = max( tMaxPlane, tMinPlane );

	// get the furthest hit distance
	vec2 t = max( tMinHit.xx, tMinHit.yz );
	float t0 = max( t.x, t.y );

	// get the minimum hit distance
	t = min( tMaxHit.xx, tMaxHit.yz );
	float t1 = min( t.x, t.y );

	// set distance to 0.0 if the ray starts inside the box
	dist = max( t0, 0.0 );

	return t1 >= dist;

}

bool intersectsTriangle(
	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,
	out vec3 barycoord, out vec3 norm, out float dist, out float side
) {

	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
	vec3 edge1 = b - a;
	vec3 edge2 = c - a;
	norm = cross( edge1, edge2 );

	float det = - dot( rayDirection, norm );
	float invdet = 1.0 / det;

	vec3 AO = rayOrigin - a;
	vec3 DAO = cross( AO, rayDirection );

	vec4 uvt;
	uvt.x = dot( edge2, DAO ) * invdet;
	uvt.y = - dot( edge1, DAO ) * invdet;
	uvt.z = dot( AO, norm ) * invdet;
	uvt.w = 1.0 - uvt.x - uvt.y;

	// set the hit information
	barycoord = uvt.wxy; // arranged in A, B, C order
	dist = uvt.z;
	side = sign( det );
	norm = side * normalize( norm );

	// add an epsilon to avoid misses between triangles
	uvt += vec4( TRI_INTERSECT_EPSILON );

	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );

}

bool intersectTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// outputs
	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	bool found = false;
	vec3 localBarycoord, localNormal;
	float localDist, localSide;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		if (
			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )
			&& localDist < minDistance
		) {

			found = true;
			minDistance = localDist;

			faceIndices = uvec4( indices.xyz, i );
			faceNormal = localNormal;

			side = localSide;
			barycoord = localBarycoord;
			dist = localDist;

		}

	}

	return found;

}

bool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)

bool _bvhIntersectFirstHit(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// output variables split into separate variables due to output precision
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float triangleDistance = INFINITY;
	bool found = false;
	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// check if we intersect the current bounds
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > triangleDistance
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			found = intersectTriangles(
				bvh_position, bvh_index, offset, count,
				rayOrigin, rayDirection, triangleDistance,
				faceIndices, faceNormal, barycoord, side, dist
			) || found;

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = boundsInfo.y;

			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			ptr ++;
			stack[ ptr ] = c2;

			ptr ++;
			stack[ ptr ] = c1;

		}

	}

	return found;

}
`,bt=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`,ye=Object.freeze(Object.defineProperty({__proto__:null,bvh_distance_functions:xt,bvh_ray_functions:yt,bvh_struct_definitions:bt,common_functions:vt},Symbol.toStringTag,{value:"Module"})),be=bt,ge=xt,Ie=`
	${vt}
	${yt}
`;export{Te as AVERAGE,ye as BVHShaderGLSL,_e as CENTER,Me as CONTAINED,De as ExtendedTriangle,Jt as FloatVertexAttributeTexture,Se as INTERSECTED,me as IntVertexAttributeTexture,ft as MeshBVH,pt as MeshBVHHelper,ve as MeshBVHUniformStruct,Be as NOT_INTERSECTED,Ee as OrientedBox,Fe as SAH,xe as StaticGeometryGenerator,$t as UIntVertexAttributeTexture,Z as VertexAttributeTexture,fe as acceleratedRaycast,he as computeBoundsTree,pe as disposeBoundsTree,le as estimateMemoryInBytes,ce as getBVHExtremes,ue as getJSONStructure,Ne as getTriangleHitPointInfo,ge as shaderDistanceFunction,Ie as shaderIntersectFunction,be as shaderStructs,de as validateBounds};
