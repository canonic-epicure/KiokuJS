Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Serializer.JSON', 'KiokuJS.Collapser.Encoder', 'KiokuJS.Collapser.Decoder', 'KiokuJS.Linker.Gatherer', 'KiokuJS.Node' ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        
        resolver        : null,
        
        serializer      : Joose.I.FutureClass('KiokuJS.Serializer.JSON'),
        
        encoder         : Joose.I.FutureClass('KiokuJS.Collapser.Encoder'),
        decoder         : Joose.I.FutureClass('KiokuJS.Collapser.Decoder'),
        
        gatherer        : Joose.I.FutureClass('KiokuJS.Linker.Gatherer')
    },
    
        
    // XXX implement 'handles' for attributes!
    methods : {
        
        encode : function (data) {
            return this.encoder.encode(data)
        },
        
        
        decode : function (data) {
            return this.decoder.decode(data, this)
        },
        
        
        gatherReferences : function (data) {
            return this.gatherer.gatherReferences(data)
        },
        
        
        serializeNodes : function (nodes) {
            var entries = Joose.A.map(nodes, function (node) {
                return node.getEntry()
            })
            
            var encodedEntries = this.encode(entries)
            
            return this.serializer.serialize(encodedEntries)
        },
        
        
        deserializeNodes : function (strings) {
            var encodedEntries  = Joose.A.map(strings, this.serializer.deserialize, this.serializer)
            
            entries             = this.decode(encodedEntries)
            
            return Joose.A.map(entries, function (entry) {
                
                this.createNodeFromEntry(entry)
                
            }, this)
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
            
            get     : function (idsToGet, scope) {
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
            }
        }
    }

})
