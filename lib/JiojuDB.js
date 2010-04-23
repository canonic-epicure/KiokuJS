Class('JiojuDB', {
    
    use : [  ],
    
    
    traits  : 'JooseX.CPS',
    
    
    has : {
        resolver            : null,
        
        liveObjects         : {
            init    : function () { return new JiojuDB.LiveObjects() }
        }
    },
    
        
    // XXX move attr initialization into constructor
    after : {
        
        initialize : function () {
            
            // wrapping the resolver with the another one, also containig the standard resolving as the lowest-priority
            this.resolver = new JiojuDB.Resolver([
                this.resolver,
                
                new JiojuDB.Resolver.Standard()
            ])
            
        }
    },
    
    
    methods : {
        
    },
    
    
    continued : {
        
        methods : {
            
            lookUp : function () {
            },
            
            
            store : function () {
                this.storeObjects(Joose.A.map(arguments, function (obj) {
                    
                    return { id : null, object : obj}
                    
                })).now()
            },
            
            
            storeAs : function (obj) {
                var objectsWithOutIDs = Joose.A.map(arguments, function (obj) {
                    
                    return { id : null, object : obj}
                    
                })
                
                objectsWithOutIDs.shift()
                
                var objectsWithIDs = []
                
                Joose.O.each(obj, function (value, key) {
                    objectsWithIDs.push({
                        id      : key,
                        object  : value
                    })
                })
                
                this.storeObjects(objectsWithIDs.concat(objectsWithOutIDs)).now()
            },
            
            
            // accepts array of { id : '', object : ''}, `id` may be missing indicating  
            storeObjects : function (objects) {
                
                
            },
            
            
            update : function () {
            },
            
            
            insert : function () {
            },
            
            
            remove : function () {
            },
            
            
            search : function () {
            }
        }
    }

})


// XXX need to keep in sync with original `Joose.O.each`
Joose.O.each = function (object, func, scope) {
    scope = scope || this
    
    for (var i in object)
        if (i != '__REF_ADR__')
            if (func.call(scope, object[i], i) === false) return
    
    if (Joose.is_IE) 
        Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
            
            if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
        })
}
