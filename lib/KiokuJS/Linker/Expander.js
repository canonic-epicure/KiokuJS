Class('KiokuJS.Linker.Expander', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has         : {
        scope           : { required : true },
        
        objects         : Joose.I.Object,
        
        nodes           : { required : true }
    },
    
    
    methods : {
        
        pinObject : function (object, ID) {
            object.__ID__ = ID
            
            return this.objects[ ID ] = object
        },
        
        
        idPinned : function (id) {
            return this.objects[ id ] != null || this.scope.idPinned(id)
        },
        
        
        idToObject : function (id) {
            return this.objects[ id ] || this.scope.idToObject(id)
        },
        
        
        visitJooseInstance : function (node, className) {
            var isNode  = node instanceof KiokuJS.Node
            var isRef   = node instanceof KiokuJS.Reference
            
            if (!isNode && !isRef) throw "Invalid Joose instance [" + node + "] encountered during inlining - only KiokuJS.Node and KiokuJS.Reference allowed"
            
            if (isRef) {
                if (this.idPinned(refID)) return this.idToObject(refID)
                
                var refNode = this.nodes[ refID ]
            
                if (!refNode) throw "Node with ID = [" + refID + "] missed during expanding" 
            
                return this.visit(refNode)
            }
            
            node.createEmptyInstance()
            
            if (node.isFirstClass()) this.scope.pinNode(node)
            
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
                    nodes       : nodes,
                    scope       : scope
                })
                
                return instance.visit(nodes)
            }
        }                    
    }
})
