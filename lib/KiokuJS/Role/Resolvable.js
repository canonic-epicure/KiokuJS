Class('KiokuJS.Role.Resolvable', {
    
    has : {
        resolver            : {
            is          : 'rw',
            required    : true 
        }
    },
    
        
    methods : {
        
        getTypeMapFor : function (className) {
            var typeMap = this.getResolver().resolveSingle(className)
            
            if (!typeMap) throw "Can't find TypeMap entry for className = [" + className + "]"
            
            return typeMap
        }
    }
})
