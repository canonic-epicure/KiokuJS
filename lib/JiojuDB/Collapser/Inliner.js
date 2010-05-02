Class('JiojuDB.Collapser.Inliner', {
    
    isa         : 'Data.Visitor',
    
    
    methods : {
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof JiojuDB.Node)) debugger //throw "Invalid Joose instance [" + node + "] encountered during inlining"
            
            if (node.ID) return new JiojuDB.Reference({
                ID : node.ID
            })
            
            return node.getEntry()
        },
        
        
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value, index) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitArrayEntry  : function (value, index, array) {
            return this.visit(value)
        },
        
        
        visitObject : function (object, className) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                if (key != '__REFADR__' && key != '__ID__') res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    }
})
