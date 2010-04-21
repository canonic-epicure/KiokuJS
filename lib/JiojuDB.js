Class('JiojuDB', {
    
    use : [  ],
    
    
    has : {
        
        resolver    : null
        
    },
    
        
    // XXX move attr initialization into constructor
    after : {
        
        initialize : function () {
            
            // wrapping the resolver with the another one, also containig the standard resolving
            this.resolver = new JiojuDB.Resolver([
                this.resolver,
                
                new JiojuDB.Resolver.Standard()
            ])
            
        }
    },
    
    
    methods : {
        
    }

})
