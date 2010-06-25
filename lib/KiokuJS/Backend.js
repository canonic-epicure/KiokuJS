Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Serializer.JSON', 'KiokuJS.Collapser.Inliner', 'KiokuJS.Linker.Outliner', 'KiokuJS.Node' ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        
        serializer      : function () { return new KiokuJS.Serializer.JSON() },
        
        inliner         : Joose.I.FutureClass('KiokuJS.Collapser.Inliner'),
        gatherer        : Joose.I.FutureClass('KiokuJS.Linker.Gatherer')
    },
    
        
    // XXX implement 'handles' for attributes!
    methods : {
        
        inlineNodes : function (data) {
            return this.inliner.inlineNodes(data)
        },
        
        
        gatherReferences : function (data) {
            return this.gatherer.gatherReferences(data)
        },
        
        
//        outlineNodes : function (data, scope) {
//            return this.outliner.outlineNodes(data, scope, this.nodeClass)
//        },
        
        
        serializeNode : function (node) {
            return this.serializer.serialize(node.getEntry())
        },
        
        
        deserializeNode : function (string) {
            var config = this.serializer.deserialize(string)
            
            config.backend = this
            
            return new this.nodeClass(config)
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function (idsToGet) {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function (nodesToInsert, scope) {
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
