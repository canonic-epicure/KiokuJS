Class('JiojuDB.TypeMap', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        inherit     : false,
        
        intrinsic   : false,
        
        forClass    : {
            required    : true
        }
    },
    
    
    methods : {
        
        canHandle : function (className) {
            if (className == this.forClass) return true
            
            if (this.inherit) {
                var classConstructor    = eval(className)
                var forClass            = eval(this.forClass)
                
                return classConstructor.meta.isa(forClass)
            }
            
            return false
        }
    },
    

    continued : {
        
        methods : {
            
            collapse : function () {
                throw "Abstract method 'collapse' called for " + this
            },
            
            
            expand : function () {
                throw "Abstract method 'expand' called for " + this
            }
        }
    }
    

})
