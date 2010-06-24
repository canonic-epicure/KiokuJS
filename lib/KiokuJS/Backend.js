Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Serializer.JSON', 'KiokuJS.Collapser.Inliner.JSPON', 'KiokuJS.Linker.Outliner.JSPON' ],
    
    
    has : {
        serializer      : function () { return new KiokuJS.Serializer.JSON() }, 
        inliner         : Joose.I.FutureClass('KiokuJS.Collapser.Inliner.JSPON'), 
        outliner        : Joose.I.FutureClass('KiokuJS.Linker.Outliner.JSPON')
    },
    
        
    // XXX implement 'handles' for attributes!
    methods : {
        
        inlineNodes : function (data) {
            return this.inliner.visit(data)
        },
        
        
        outline : function (data) {
            return this.outliner.visit(data)
        },
        
        
        serialize : function (entry) {
            return this.serializer.serialize(entry)
        },
        
        
        deserialize : function (serializedEntry) {
            return this.serializer.deserialize(serializedEntry)
        },
        
        
        serializeNode : function (node) {
            return this.serializer.serialize(node.getEntry())
        },
        
        
        deserializeNode : function (string) {
            return 
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
