Class('JiojuDB.Resolver.Standard', {
    
    isa         : 'JiojuDB.Resolver',
    
    
    use         : [
        'JiojuDB.TypeMap.JooseClass',
        'JiojuDB.TypeMap.Object',
        'JiojuDB.TypeMap.Array',
        'JiojuDB.TypeMap.Function'
    ],
    
    
        
    methods : {
        
        initialize : function () {
            
            this.addEntry(new JiojuDB.TypeMap.JooseClass())
            
            this.addEntry(new JiojuDB.TypeMap.Object())
            this.addEntry(new JiojuDB.TypeMap.Array())
            this.addEntry(new JiojuDB.TypeMap.Function())
        }
    }

})
