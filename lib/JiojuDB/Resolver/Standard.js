Class('JiojuDB.Resolver.Standard', {
    
    isa         : 'JiojuDB.Resolver',
    
    
    use         : [
        'JiojuDB.TypeMap.MOP',
        'JiojuDB.TypeMap.RegExp',
        'JiojuDB.TypeMap.Date'
    ],
    
    
    // XXX move attr initialization into constructor
    after : {
        
        initialize : function () {
            
            this.addEntry(new JiojuDB.TypeMap.MOP())
            this.addEntry(new JiojuDB.TypeMap.RegExp())
            this.addEntry(new JiojuDB.TypeMap.Date())
        }
    },
    
        
    methods : {
        
    }

})
