Class('JiojuDB.TypeMap', {
    
    use     : 'Data.UUID',
    
    
    has : {
        inherit     : false,
        
        intrinsic   : false,
        
        forClass    : {
            required    : true
        },
        
        classVersion    : null,
        isVersionExact  : true 
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
        },
        
        
        getIDFor : function (instance) {
            return Data.UUID.my.uuid()
        },
        
        
        collapse : function (options) {
            throw "Abstract method 'collapse' called for " + this
        },
        
        
        refresh : function (options) {
            throw "Abstract method 'refresh' called for " + this
        },
        
        
        expand : function (options) {
            throw "Abstract method 'expand' called for " + this
        }
        
    }
})
