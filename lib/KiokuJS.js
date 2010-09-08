Class('KiokuJS', {
    
    has : {
        backend             : { required : true }
    },
    
        
    methods : {
        
        // XXX merge KiokuJS and backend
        newScope    : function () {
            return this.backend.newScope()
        }
    },
    
    
    my : {
        
        has : {
            HOST        : null
        },
        
        
        methods : {
        
            connect : function () {
                var hostMeta = this.HOST.meta
                
                return hostMeta.instantiate.apply(hostMeta, arguments)
            }
        }
    }

})


// XXX need to keep in sync with original `Joose.O.each`
Joose.O.each = function (object, func, scope) {
    scope = scope || this
    
    for (var i in object) 
        if (i != '__REFADR__')
            if (func.call(scope, object[i], i) === false) return false
    
    if (Joose.is_IE) 
        return Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
            
            if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
        })
}


Joose.O.isEmpty = function (object) {
    for (var i in object) if (object.hasOwnProperty(i) && i != '__REFADR__') return false
    
    return true
}
