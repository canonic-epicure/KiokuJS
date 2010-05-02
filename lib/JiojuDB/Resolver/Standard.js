Class('JiojuDB.Resolver.Standard', {
    
    isa         : 'JiojuDB.Resolver',
    
    
    use         : [
        'JiojuDB.TypeMap.Feature.NoDeps',
    
        'JiojuDB.TypeMap.Joose',
        'JiojuDB.TypeMap.Object',
        'JiojuDB.TypeMap.Array'
    ],
    

    
    after : {
        
        initialize : function () {
            
            // the order matter
            
            this.addEntry(new JiojuDB.TypeMap.Joose({
                trait : JiojuDB.TypeMap.Feature.NoDeps,
                
                inherit : true
            }))
            
            this.addEntry(new JiojuDB.TypeMap.Object())
            
            this.addEntry(new JiojuDB.TypeMap.Array())
        }
    }

})
