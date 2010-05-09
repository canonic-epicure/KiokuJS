Class('JiojuDB.Collapser.Inliner', {
    
    isa         : 'Data.Visitor',
    
    use         : 'JiojuDB.Reference',
    
    
    methods : {
        
        visitFirstClassNode : function (node) {
            return new JiojuDB.Reference({
                ID : node.ID
            })
        },
        
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof JiojuDB.Node)) throw "Invalid Joose instance [" + node + "] encountered during inlining"
            
            if (node.isFirstClass()) return this.visitFirstClassNode(node)
            
            return node.getEntry()
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
    }
})
