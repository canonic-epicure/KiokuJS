Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [
        'KiokuJS.Resolver', 
        'KiokuJS.Resolver.Standard', 
    
        'KiokuJS.Serializer.JSON', 
        'KiokuJS.Collapser.Encoder', 
        'KiokuJS.Linker.Decoder', 
        'KiokuJS.Linker.RefGatherer', 
        
        'KiokuJS.Scope',
        'KiokuJS.Node' 
    ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        scopeClass      : Joose.I.FutureClass('KiokuJS.Scope'),
        
        resolver        : null,
        
        serializer      : Joose.I.FutureClass('KiokuJS.Serializer.JSON'),
        
        encoder         : Joose.I.FutureClass('KiokuJS.Collapser.Encoder'),
        decoder         : Joose.I.FutureClass('KiokuJS.Linker.Decoder'),
        
        gatherer        : Joose.I.FutureClass('KiokuJS.Linker.RefGatherer')
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
        
        
        encodeNode : function (node) {
            return this.encoder.encodeNodes([ node ])[ 0 ]
        },
        
        
        encodeNodes : function (nodes) {
            return this.encoder.encodeNodes(nodes)
        },
        
        
        decodeEntry : function (entry) {
            return this.decoder.decodeEntries([ entry ], this)[ 0 ]
        },
        
        
        decodeEntries : function (entries) {
            return this.decoder.decodeEntries(entries, this)
        },
        
        
        gatherReferences : function (data) {
            return this.gatherer.gatherReferences(data)
        },
        
        
        serializeNode : function (node) {
            return this.serializeNodes([ node ])[ 0 ]
        },
        
        
        serializeNodes : function (nodes) {
            var encodedEntries  = this.encodeNodes(nodes)
            var serializer      = this.serializer
            
            return Joose.A.map(encodedEntries, function (entry) {
                
                return serializer.serialize(entry)
            })
        },
        
        
        deserializeNode : function (string) {
            return this.deserializeNodes([ string ])[ 0 ]
        },
        
        
        deserializeNodes : function (strings) {
            var serializer      = this.serializer
            
            var encodedEntries  = Joose.A.map(strings, serializer.deserialize, serializer)
            
            return this.decodeEntries(encodedEntries)
        },
        
        
        createNodeFromEntry : function (entry) {
            return this.nodeClass.newFromEntry(entry, this.resolver)
        },
        
        
        createNodeFromObject : function (object) {
            return this.nodeClass.newFromObject(object, this.resolver)
        },
        
        
        // XXX not tested
        decodeObjects : function (packet) {
            var scope = this.newScope()
            
            var nodes       = {}
            
            Joose.A.each(this.decodeEntries(packet.entries), function (node) {
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
        
        
        // XXX not tested
        encodeObjects : function (wIDs, woIDs) {
            var scope = this.newScope()
            
            return scope.includeNewObjects(wIDs, woIDs)
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function (idsToGet, scope, mode) {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function (nodesToInsert, scope, mode) {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            remove  : function () {
                throw "Abstract method 'remove' called for " + this
            },
            
            
            exists  : function () {
                throw "Abstract method 'exists' called for " + this
            },
            
            
            search : function (scope, arguments) {
                throw "Abstract method 'search' called for " + this
            }
        }
    }

})
