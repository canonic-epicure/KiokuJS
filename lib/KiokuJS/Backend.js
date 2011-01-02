Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [
        'KiokuJS.Resolver', 
        'KiokuJS.Resolver.Standard', 
    
        'KiokuJS.Serializer.JSON',
        
        'KiokuJS.Linker',
        
        'KiokuJS.Scope',
        'KiokuJS.Node' 
    ],
    
    
    has : {
        andMax          : 20,
        
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        scopeClass      : Joose.I.FutureClass('KiokuJS.Scope'),
        
        resolver        : null,
        
        serializer      : {
            handles     : [ 'serialize', 'deserialize' ],
            init        : Joose.I.FutureClass('KiokuJS.Serializer.JSON')
        }
    },
    
        
    methods : {
        
        initialize : function () {
            var resolver    = this.resolver
            
            // wrapping the possibly passed resolver with another one, containig the standard resolver as the lowest-priority
            this.resolver = new KiokuJS.Resolver( 
                (resolver ? [ resolver ] : []).concat( new KiokuJS.Resolver.Standard() )
            )
        },
        
        
        newScope    : function (options) {
            return new this.scopeClass(Joose.O.copy({
                backend     : this,
                resolver    : this.resolver
            }, options))
        },
        
        
        createNodeFromEntry : function (entry) {
            return this.nodeClass.newFromEntry(entry, this.resolver)
        },
        
        
        createNodeFromObject : function (object) {
            return this.nodeClass.newFromObject(object, this.resolver)
        },
        
        
        decodePacket : function (packet) {
            var scope = this.newScope()
            
            var linker = new KiokuJS.Linker({
                scope       : scope,
                
                entries     : packet.entries
            })
            
            linker.animateNodes()
            
            var objects = {}
            
            Joose.A.each(packet.customIDs, function (id) { 
                objects[ id ] = scope.idToObject(id)
            })
                
            return [ objects, Joose.A.map(packet.IDs, scope.idToObject, scope) ]
        },
        
        
        encodePacket : function (wIDs, woIDs) {
            var scope = this.newScope()
            
            return scope.includeNewObjects(wIDs, woIDs)
        },
        
        
        launchAndNormalizeResults : function () {
            
            this.ANDMAX(this.andMax).except(function () {
                
                // re-throw the 1st caught exception
                Joose.A.each(arguments, function (ex) {
                    if (ex !== undefined) throw ex
                })
                
            }).then(function () {
                
                // assumes that methods for individual entries always returns a single result
                var res = Joose.A.map(arguments, function (results) {
                    return results[ 0 ]
                })
                
                this.CONTINUE(res)
                
            }).now()
        }
    },
    
    
    continued : {
        
        methods : {
            
            getEntry : function (id, mode) {
                throw "Abstract method 'getEntry' called for " + this
            },
            
            
            get     : function (idsToGet, mode) {
                var me = this
                
                Joose.A.each(idsToGet, function (id) {
                    
                    me.AND(function () {
                        me.getEntry(id, mode).now()
                    })
                })
                
                me.launchAndNormalizeResults()
            },
            
            
            insertEntry : function () {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            insert  : function (entriesToInsert, mode) {
                var me = this
                
                Joose.A.each(entriesToInsert, function (id) {
                    
                    me.AND(function () {
                        me.insertEntry(id, mode).now()
                    })
                })
                
                me.launchAndNormalizeResults()
            },
            
            
            removeID  : function (ID) {
                throw "Abstract method 'removeID' called for " + this
            },
            
            
            removeEntry  : function (entry) {
                throw "Abstract method 'removeEntry' called for " + this
            },
            
            
            remove  : function (idsOrEntriesToRemove) {
                var me      = this
                
                Joose.A.each(idsOrEntriesToRemove, function (entryOrId) {
                    
                    me.AND(function () {
                        
                        // entry
                        if (entryOrId === Object(entryOrId))
                            this.removeEntry(entryOrId).now()
                        else
                            this.removeID(entryOrId).now()
                    })
                })
                
                me.launchAndNormalizeResults()
            },
            
            
            existsID  : function (id) {
                throw "Abstract method 'existsID' called for " + this
            },
            
            
            exists  : function (idsToCheck) {
                var me      = this
                
                Joose.A.each(idsToCheck, function (id) {
                    
                    me.AND(function () {
                        
                        me.existsID(id).now()
                    })
                })
                
                me.launchAndNormalizeResults()
            },
            
            
            search : function (scope, arguments) {
                throw "Abstract method 'search' called for " + this
            }
        }
    }

})

// placing this override here, since backend is always required

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
