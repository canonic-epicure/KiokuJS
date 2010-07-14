Class('KiokuJS.Linker.Expander', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has         : {
        scope           : { required : true }
    },
    
    
    methods : {
        
        visitJooseInstance : function (node, className) {
            var isNode  = node instanceof KiokuJS.Node
            var isRef   = node instanceof KiokuJS.Reference
            
            if (!isNode && !isRef) throw "Invalid Joose instance [" + node + "] encountered during inlining - only KiokuJS.Node and KiokuJS.Reference allowed"
            
            var scope   = this.scope
            
            if (isRef) {
                var refNode = scope.idToNode(node.ID)
                
                if (!refNode) throw "Node with ID = [" + refID + "] missed during expanding"
                
                
                if (refNode.isLive()) return scope.idToObject(node.ID)
                
                return this.visit(refNode)
            }
            
            node.createEmptyInstance()
            
            if (node.isFirstClass()) scope.pinNode(node)
            
            return node.populate(this)
        },
        
        
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value, index) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    },
    
    
    my : {
        
        methods : {
            
            expandNodes   : function (nodes, scope) {
                
                var instance = new this.HOST({
                    scope       : scope
                })
                
                return instance.visit(nodes)
            }
        }                    
    }
})
