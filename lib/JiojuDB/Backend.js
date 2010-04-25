Class('JiojuDB.Backend', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
    },
    
    
    // XXX move attr initialization into constructor
    after : {
        
        initialize : function () {
            
        }
    },
    
        
    methods : {
        
        
    },
    
    
    continued : {
        
        methods : {
            
            get     : function () {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function () {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            remove  : function () {
                throw "Abstract method 'remove' called for " + this
            },
            
            
            exists  : function () {
                throw "Abstract method 'exists' called for " + this
            }
        }
    }

})
