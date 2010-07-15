Class('KiokuJS.Linker.Expander', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has         : {
        scope           : { required : true }
    },
    
    
    methods : {
        
        visitNode : function (node) {
            node.createEmptyInstance()
            
            if (node.isFirstClass()) this.scope.pinNode(node)
            
            return node.populate(this)
        },
        
        
        visitReference : function (reference) {
            var scope   = this.scope
            
            var refNode = scope.idToNode(reference.ID)
            
            if (!refNode) throw "Node with ID = [" + reference.ID + "] missed during expanding"
            
            
            if (refNode.isLive()) return refNode.object
            
            return this.visit(refNode)
        },
        
        
        visitJooseInstance : function (node, className) {
            if (node instanceof KiokuJS.Node) return this.visitNode(node)

            if (node instanceof KiokuJS.Reference) return this.visitReference(node)

            throw "Invalid Joose instance [" + node + "] encountered during inlining - only `KiokuJS.Node` and `KiokuJS.Reference` allowed"
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
