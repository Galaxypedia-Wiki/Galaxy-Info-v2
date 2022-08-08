var y=Object.defineProperty;var s=e=>y(e,"__esModule",{value:!0});var c=(e,r)=>{s(e);for(var t in r)y(e,t,{get:r[t],enumerable:!0})};c(exports,{deserialize:()=>i,serialize:()=>o});function o(e){if(typeof e=="string"||typeof e=="number"||typeof e=="boolean"||e===null)return["native",e];if(Object.prototype.toString.call(e)==="[object Object]"){const r=[];for(const[t,n]of Object.entries(e))r.push([t,o(n)]);return["object",r]}else{if(Object.prototype.toString.call(e)==="[object Array]")return["array",e.map(o)];if(typeof e=="bigint")return["bigint",e.toString()];if(e instanceof Date)return["date",e.toISOString()];if(e instanceof Error)return["error",e.message??JSON.stringify(e)??e??"unknown error"];throw new Error("data unserializable")}}const u={object(e){const r={};for(const[t,n]of e)r[t]=i(n);return r},array(e){return e.map(i)},bigint(e){return BigInt(e)},date(e){return new Date(e)},error(e){return new Error(e)},native(e){return e}};function i(e){if(typeof e!="object")throw new Error(`Expected serialized data to be an object. Got ${typeof e}.`);if(!e)throw new Error(`Serialized data is expected to be truthy. Data: ${e}`);return u[e[0]](e[1])}
