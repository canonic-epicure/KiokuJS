Class('JiojuDB.Collapser.Inliner', {
    
    isa         : 'Data.Visitor',
    
    
    methods : {
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof JiojuDB.Node)) throw "Invalid Joose instance [" + node + "] encountered during inlining"
            
            if (node.ID) return new JiojuDB.Reference({
                ID : node.ID
            })
            
            return node.getEntry()
        }
    }
})
