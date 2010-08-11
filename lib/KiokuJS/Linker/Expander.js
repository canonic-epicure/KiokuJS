Class('KiokuJS.Linker.Expander', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has         : {
        scope           : { required : true }
    },
    
    
    methods : {
        
        visitNode : function (node) {
            var scope   = this.scope
            
            if (node.isLive())
                node.clearInstance()
            else {
                // newly created instance need to has the __REF_ADR__ as this property
                // is being extensively used internally
                node.createEmptyInstance()
                
                this.assignRefAdrTo(node.getInstance())
            
                if (node.isFirstClass()) scope.pinNode(node)
            }
            
            node.populate(this)
            
            return node.getInstance()
        },
        
        
        visitReference : function (reference) {
            var scope   = this.scope
            
            var refNode = scope.idToNode(reference.ID)
            
            if (!refNode) throw "Node with ID = [" + reference.ID + "] missed during expanding"
            
            
            if (refNode.isLive()) {
                this.assignRefAdrTo(refNode.object)
                
                return refNode.getInstance()
            }
            
            // `visit` and not(!) `visitNode` to utilize the `seen` cache for already processed nodes
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
