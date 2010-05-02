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
        
        getRequiredClasses : function () {
            if (this.classVersion) {
                var obj = {}
                
                obj[ this.forClass ] = this.classVersion
                
                return [ obj ]
            }
            
            return [ this.forClass ]
        },
        
        
        // XXX add versions check
        canHandle : function (className) {
            if (className == this.forClass) return true
            
            if (this.inherit) {
                var classConstructor    = eval(className)
                var forClass            = eval(this.forClass)
                
                if (classConstructor.meta) return classConstructor.meta.isa(forClass)
            }
            
            return false
        },
        
        
        acquireIDFor : function (instance, desiredId) {
            return desiredId != null ? desiredId : Data.UUID.uuid()
        },
        
        
        collapse : function (instance, collapser) {
            throw "Abstract method 'collapse' called for " + this
        },
        
        
//        refresh : function (instance, data, linker) {
//            throw "Abstract method 'refresh' called for " + this
//        },
        
        
        expand : function (data, linker) {
            throw "Abstract method 'expand' called for " + this
        }
        
    }
})
