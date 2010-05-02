Class('JiojuDB.Serializer.JSPON', {
    
    isa         : 'JiojuDB.Serializer.JSON',
    
    does        : 'JiojuDB.Serializer',
    
    use         : 'JiojuDB.Reference',
    
    
    methods : {
        
        visitJooseInstance : function (reference, className) {
            if (!(reference instanceof JiojuDB.Reference)) throw "Invalid Joose instance [" + reference + "] encountered during serialization"
            
            return this.visit({
                '$ref' : reference.ID
            })
        }
    }
    
})
