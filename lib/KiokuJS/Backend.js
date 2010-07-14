Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    does    : 'KiokuJS.Role.Resolvable',
    
    use     : [ 'KiokuJS.Serializer.JSON', 'KiokuJS.Collapser.Encoder', 'KiokuJS.Linker.Gatherer', 'KiokuJS.Node' ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        
        resolver        : { is : 'rw' },
        
        serializer      : Joose.I.FutureClass('KiokuJS.Serializer.JSON'),
        
        encoder         : Joose.I.FutureClass('KiokuJS.Collapser.Encoder'),
        decoder         : Joose.I.FutureClass('KiokuJS.Collapser.Decoder'),
        
        gatherer        : Joose.I.FutureClass('KiokuJS.Linker.Gatherer')
    },
    
        
    // XXX implement 'handles' for attributes!
    methods : {
        
        encodeNodes : function (data) {
            return this.encoder.encodeNodes(data)
        },
        
        
        gatherReferences : function (data) {
            return this.gatherer.gatherReferences(data)
        },
        
        
        serializeNode : function (node) {
            return this.serializer.serialize(node.getEntry())
        },
        
        
        deserializeNode : function (string) {
            var entry = this.serializer.deserialize(string)
            
            return this.createNodeFromEntry(entry)
        },
        
        
        createNodeFromEntry : function (entry) {
            return this.nodeClass.newFromEntry(entry, this)
        },
        
        
        createNodeFromObject : function (object) {
            return this.nodeClass.newFromObject(object, this)
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
