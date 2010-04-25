Class('JiojuDB.Serializer.JSPON', {
    
    isa         : 'JiojuDB.Serializer.JSON',
    
    
    methods : {
        
        serialize   : function (node) {
            
            
            
            
            return this.SUPER(entry)
        },
        
        
        deserialize : function (string) {
            var rawData = this.SUPER(string)
            
            
        },
        
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof JiojuDB.Node)) throw "Invalid Joose instance [" + node + "] encountered during serialization"
            
            if (node.firstClass) return this.visit({
                '$ref' : node.id
            })
            
            return this.visit(node.getEntry(false))
        }
        
    }
    
})
