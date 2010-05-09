Class('JiojuDB.TypeMap.Object', {
    
    isa     : 'JiojuDB.TypeMap',
    
    does    : 'JiojuDB.TypeMap.Feature.NoDeps',
    
    
    has : {
        forClass    : 'Object'
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Object'
        },
        
        
        collapse : function (instance, collapser) {
            var data = {}
            
            Joose.O.eachOwn(instance, function (value, key) {

                data[ key ] = collapser.visit(value)
            })
            
            return data
        },
        
        
        refresh : function (instance, data, linker) {
        },
        
        
        expand : function (data, linker) {
        }
    }

})