Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 
        'KiokuJS.Serializer.JSON', 
        'KiokuJS.Collapser.Encoder', 
        'KiokuJS.Linker.Decoder', 
        'KiokuJS.Linker.RefGatherer', 
        'KiokuJS.Node' 
    ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        
        resolver        : null,
        
        serializer      : Joose.I.FutureClass('KiokuJS.Serializer.JSON'),
        
        encoder         : Joose.I.FutureClass('KiokuJS.Collapser.Encoder'),
        decoder         : Joose.I.FutureClass('KiokuJS.Linker.Decoder'),
        
        gatherer        : Joose.I.FutureClass('KiokuJS.Linker.RefGatherer')
    },
    
        
    // XXX implement 'handles' for attributes!
    methods : {
        
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
