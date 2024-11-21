// guarda en el cache dinamico 
const actualizarCacheDinamico = (dynamicCache, req, res)=>{

    //si la respuesta logra obtener algo (data), actualizamos el cache
    if(res.ok){
        return caches.open(dynamicCache).then(cache =>{
            cache.put(req, res.clone())
            return res.clone();
        });
     
    }else {
        //si no logra obtener, retornamos la respuesta original osea el error 
    
        return res;
    }
    }

    
//CAHCE WITH NETWORK UPDATE
//nos sirve para actualiza rl cache inmutable
    const actualizarCacheStatico = (staticoCache, req, APP_SHELL_INMUTABLE)=>{

        
        if(APP_SHELL_INMUTABLE.includes(req.url)){
            //No hace falta actualizar el inmutable
           
        }else {
           
            return fetch (req)
            .then(res => {
                return actualizarCacheDinamico(staticoCache, req, res)
            })
         }
        }

        
const manejoApiNotas =(cacheName, req) => {
    if(req.clone().method === 'POST'){
        if (self.registration.sync) {
            return req.clone().text().then(body => {
                const bodyObj =JSON.parse(body);
                return guardarNota(bodyObj);
            });

        }else{
            return fetch(req);
        }
    }else{
        return fetch(req).then(resp => {
            if(resp.ok){
                actualizarCacheDinamico(cacheName, req, resp.clone());
                return resp.clone();
            }else{
                return caches.match(req);
            }
        }).catch(err => {
            return caches.match(req);
        });
    }
}
    
const manejoApiExpenses =(cacheName, req) => {
    if(req.clone().method === 'POST'){
        if (self.registration.sync) {
            return req.clone().text().then(body => {
                const bodyObj =JSON.parse(body);
                return guardarExpense(bodyObj);
            });

        }else{
            return fetch(req);
        }
    }else{
        return fetch(req).then(resp => {
            if(resp.ok){
                actualizarCacheDinamico(cacheName, req, resp.clone());
                return resp.clone();
            }else{
                return caches.match(req);
            }
        }).catch(err => {
            return caches.match(req);
        });
    }
}
        