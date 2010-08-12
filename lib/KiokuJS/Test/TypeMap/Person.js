Class('KiokuJS.Test.TypeMap.Person', {
    
    isa     : 'KiokuJS.TypeMap.Joose',
    
    
    has : {
        forClass    : 'KiokuJS.Test.Person',
        inherit     : true
    },
    
        
    methods : {
        
//        acquireIDFor : function (instance, desiredId) {
//            if (instance.meta.does('KiokuJS.Feature.Class.OwnID')) return instance.acquireID(desiredId)
//            
//            return this.SUPER(instance, desiredId)
//        },
//        
//        
//        collapse : function (instance, collapser) {
//            
//            var data = {}
//            
//            Joose.O.each(instance.meta.getAttributes(), function (attribute, name) {
//                
//                data[ name ] = collapser.visit(attribute.getRawValueFrom(instance))
//            })
//            
//            return data
//        },
//        
//        
////        refresh : function (instance, collapser) {
////        },
//        
//        
//        expand : function (data, linker) {
//        }
    }

})
