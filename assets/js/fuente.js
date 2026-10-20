/* Si hay API WordPress configurada, consulta la fuente institucional; si no, muestra el catálogo local. */
window.REDACTIVATE_LOAD_DATA = async function () {
 const fallback=window.REDACTIVATE_INICIATIVAS || [];
 const endpoint=window.REDACTIVATE_API_URL;
 if(!endpoint)return fallback;
 try{
  const response=await fetch(endpoint,{method:'GET',credentials:'omit',headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();
  if(!Array.isArray(data))throw new Error('Formato no esperado');
  window.REDACTIVATE_INICIATIVAS=data;
  return data;
 }catch(err){console.warn('No se pudo consultar la fuente WordPress. Se usa el inventario local.',err);return fallback;}
};
