Role('KiokuJS.Role.Resolvable', {
    
    requires : [ 'getResolver' ],
    
        
    methods : {
        
        getClassNameFor : function (object) {
            if (Joose.O.isInstance(object))      return object.meta.name
            
            return Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/\]$/, '')
        },
        
        
        getTypeMapFor : function (className) {
            if (typeof className != 'string') className = this.getClassNameFor(className)
            
            var typeMap = this.getResolver().resolveSingle(className)
            
            if (!typeMap) throw "Can't find TypeMap entry for className = [" + className + "]"
            
            return typeMap
        }
    }
})
