Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [
        'KiokuJS.Resolver', 
        'KiokuJS.Resolver.Standard', 
    
        'KiokuJS.Serializer.JSON',
        
        'KiokuJS.Scope',
        'KiokuJS.Node' 
    ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        scopeClass      : Joose.I.FutureClass('KiokuJS.Scope'),
        
        resolver        : null,
        
        serializer      : Joose.I.FutureClass('KiokuJS.Serializer.JSON')
    },
    
        
    // XXX implement 'handles' for attributes!
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
        
        
        serialize : function (entries) {
            var serializer = this.serializer
            
            return Joose.A.map(entries, function (entry) {
                
                return serializer.serialize(entry)
            })
        },
        
        
        deserialize : function (strings) {
            var serializer = this.serializer
            
            return Joose.A.map(strings, function (string) {
                
                return serializer.deserialize(string)
            })
        },
        
        
        decodePacket : function (packet) {
            var scope = this.newScope()
            
            var nodes       = {}
            
            Joose.A.each(scope.decodeEntries(packet.entries), function (node) {
                nodes[ node.ID ] = node
            })
                
            var linker = new KiokuJS.Linker({
                scope       : scope,
                
                nodes       : nodes
            })
            
            linker.animateNodes()
            
            var objects = {}
            
            Joose.O.each(packet.customIDs, function (value, id) { 
                objects[ id ] = scope.idToObject(id)
            })
                
            return [ objects, Joose.A.map(packet.IDs, scope.idToObject, scope) ]
        },
        
        
        encodeObjects : function (wIDs, woIDs) {
            var scope = this.newScope()
            
            return scope.includeNewObjects(wIDs, woIDs)
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function (idsToGet, mode) {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function (entriesToInsert, mode) {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            remove  : function (idsOrEntriesToRemove) {
                throw "Abstract method 'remove' called for " + this
            },
            
            
            exists  : function (idsToCheck) {
                throw "Abstract method 'exists' called for " + this
            },
            
            
            search : function (scope, arguments) {
                throw "Abstract method 'search' called for " + this
            }
        }
    }

})
