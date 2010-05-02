Class('JiojuDB.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : 'JiojuDB.Serializer.JSPON',
    
    
    has : {
        serializer      : { 
            init : function () { return new JiojuDB.Serializer.JSPON() } 
        }
    },
    
        
    methods : {
        
        serialize : function (entry) {
            return this.serializer.serialize(entry)
        }
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
