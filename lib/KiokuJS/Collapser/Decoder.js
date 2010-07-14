Class('KiokuJS.Collapser.Decoder', {
    
    isa         : 'Data.Visitor',
    

    has         : {
        backend         : { required : true },
        reservedKeys    : /^\$ref$|^\$entry$/
    },
    
    
    methods : {
        
        visitJooseInstance : function (node, className) {
            throw "Joose instance [" + node + "] encountered during decoding - data should contain only native structures"
        },
        
        
        // a bit faster visiting of array
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var refID = object.$ref
            
            if (refID) {
                if (this.idPinned(refID)) return this.idToObject(refID)
                
                var refNode = this.nodes[ refID ]
            
                if (!refNode) throw "Node with ID = [" + refID + "] missed during expanding" 
            
                return this.visit(refNode)
            }
            
            if (object.$entry) {
                var node = this.scope.getBackend().getNodeFromEntry(object)
                
                return this.visitJooseInstance(node)
            }
            
            
            
            var isNode  = node instanceof KiokuJS.Node
            var isRef   = node instanceof KiokuJS.Reference
            
            if (!isNode && !isRef) throw "Invalid Joose instance [" + node + "] encountered during inlining - "
            
            if (isNode && node.isFirstClass() || isRef) return this.createReference(node)
            
            return node.getEntry()
            
            
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                if (this.reservedKeys.test(key)) key = 'public:' + key
                
                res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    },
    
    
    my : {

        methods : {
            
            decodeNodes : function (data, backend) {
                var instance = new this.HOST({
                    backend : backend
                })
                
                return instance.visit(data)
            }
        }                    
    }
})
