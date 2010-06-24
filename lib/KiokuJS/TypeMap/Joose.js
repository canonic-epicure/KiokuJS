Class('KiokuJS.TypeMap.Joose', {
    
    isa     : 'KiokuJS.TypeMap',
    
    
    has : {
        forClass    : 'Joose.Meta.Object',
        inherit     : false
    },
    
        
    methods : {
        
        acquireIDFor : function (instance, desiredId) {
            if (instance.meta.does('KiokuJS.Feature.OwnID')) return instance.acquireID(desiredId)
            
            return this.SUPER(instance, desiredId)
        },
        
        
        collapse : function (instance, collapser) {
            
            var data = {}
            
            instance.meta.getAttributes().each(function (attribute, name) {
                
                data[ name ] = collapser.visit(attribute.getRawValueFrom(instance))
            })
            
            return data
        },
        
        
//        refresh : function (instance, collapser) {
//        },
        
        
        expand : function (entry, linker) {
            
            
            
        }
    }

})
