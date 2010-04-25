Class('JiojuDB', {
    
    use : [  ],
    
    
    traits  : 'JooseX.CPS',
    
    
    has : {
        resolver            : null,
        backend             : null,
        
        liveObjects         : {
            init    : function () { return new JiojuDB.LiveObjects() }
        }
    },
    
        
    // XXX move attr initialization into constructor
    after : {
        
        initialize : function () {
            
            // wrapping the resolver with the another one, also containig the standard resolving as the lowest-priority
            this.resolver = new JiojuDB.Resolver( 
                (this.resolver ? [ this.resolver ] : []).concat( new JiojuDB.Resolver.Standard() )
            )
            
        }
    },
    
    
    methods : {
        
    },
    
    
    continued : {
        
        methods : {
            
            lookUp : function () {
            },
            
            
            store : function () {
                this.storeObjects({}, arguments).now()
            },
            
            
            storeAs : function () {
                var objectsWithOutIDs = Array.prototype.slice.call(arguments)
                
                var objectsWithIDs = {}
                
                Joose.O.each(objectsWithOutIDs.shift() || {}, function (value, key) {
                    objectsWithIDs.push({
                        id      : key,
                        object  : value
                    })
                })
                
                this.storeObjects(objectsWithIDs.concat(objectsWithOutIDs)).now()
            },
            
            
            storeObjects : function (objectWithIds, allObjects) {
                
                this.resolver.fetchClasses().then(function () {
                
                    var collapser = new JiojuDB.Collapser({
                        resolver            : this.resolver,
                        liveObjects         : this.liveObjects,
                        
                        objectWithIds       : objectWithIds,
                        allObjects          : allObjects
                    })
                    
                    collapser.collapse(allObjects)
                    
                    var entries = collapser.getEntries()
                    
                    this.backend.insert(entries).ensure(function () {
                        
                        collapser.cleanUp()
                    }).now()
                    
                }, this).now()
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
        if (i != '__ID__')
            if (func.call(scope, object[i], i) === false) return false
    
    if (Joose.is_IE) 
        return Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
            
            if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
        })
}


Joose.O.isEmpty = function (object) {
    for (var i in object) if (object.hasOwnProperty(i) && i != '__ID__') return false
    
    return true
}
