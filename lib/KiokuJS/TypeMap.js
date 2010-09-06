Class('KiokuJS.TypeMap', {
    
    use     : 'Data.UUID',
    
    
    has : {
        inherit     : false,
        
        intrinsic   : false,

        // this flag will be set for native ( [], {} ) data structures which can be passed through w/o own entries 
        passThrough : false,      
        
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
                
                var classConstructor        = eval(className)
                var forClass                = eval(this.forClass)
                
                if (classConstructor.meta) return classConstructor.meta.isa(forClass)
            }
            
            return false
        },
        
        
        acquireID : function (node, desiredId) {
            return desiredId != null ? desiredId : Data.UUID.uuid()
        },
        
        
        collapse : function (node, collapser) {
            throw "Abstract method 'collapse' called for " + this
        },
        
        
        clearInstance : function (node) {
            throw "Abstract method 'clear' called for " + this
        },
        
        
        createEmptyInstance : function (node) {
            throw "Abstract method 'createEmptyInstance' called for " + this
        },
        
        
        populate : function (node, expander) {
            throw "Abstract method 'expand' called for " + this
        }
    }
})
