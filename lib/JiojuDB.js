Class('JiojuDB', {
    
    traits  : 'JooseX.CPS',
    
    
    use     : [ 'JiojuDB.Resolver', 'JiojuDB.Resolver.Standard', 'JiojuDB.LiveObjects', 'JiojuDB.Collapser' ],
    
    
    has : {
        resolver            : null,
        backend             : null,
        
        liveObjects         : {
            init    : function () { return new JiojuDB.LiveObjects() }
        }
    },
    
        
    methods : {
        
        initialize : function () {
            
            // wrapping the resolver with the another one, also containig the standard resolving as the lowest-priority
            this.resolver = new JiojuDB.Resolver( 
                (this.resolver ? [ this.resolver ] : []).concat( new JiojuDB.Resolver.Standard() )
            )
        }
    },
    
    
    continued : {
        
        methods : {
            
            lookUp : function () {
            },
            
            
            store : function () {
                this.storeObjects({}, Array.prototype.slice.call(arguments)).now()
            },
            
            
            storeAs : function () {
                var objectsWithOutIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects(objectsWithOutIDs.shift(), objectsWithOutIDs).now()
            },
            
            
            storeObjects : function (objectWithIds, objectsWithOutIDs) {
                
                this.resolver.fetchClasses().then(function () {
                
                    var collapser = new JiojuDB.Collapser({
                        resolver            : this.resolver,
                        inliner             : this.backend.inliner
                    })
                    
                    var firstClassNodes = collapser.collapse(objectWithIds, objectsWithOutIDs)
                    
                    
                    // extracting entry from each first-class node
                    
                    var liveObjects = this.liveObjects
                    
                    var entries     = Joose.A.map(firstClassNodes, function (node) {
                            
                        var entry = node.getEntry()
                        
                        liveObjects.store(node)
                        
                        return entry
                    })
                    
                    this.backend.insert(entries).now()
                    
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
        if (i != '__ID__' && i != '__REFADR__')
            if (func.call(scope, object[i], i) === false) return false
    
    if (Joose.is_IE) 
        return Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
            
            if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
        })
}


Joose.O.isEmpty = function (object) {
    for (var i in object) if (object.hasOwnProperty(i) && i != '__ID__' && i != '__REFADR__') return false
    
    return true
}
