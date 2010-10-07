Class('KiokuJS.Linker.RefGatherer', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has : {
        references      : Joose.I.Object
    },    
    
    
    methods : {
        
        visitObject : function (object, className) {
            if (object.$ref && object.type != 'lazy') this.references[ object.$ref ] = true
            
            return this.SUPERARG(arguments)
        }
    },
    
    
    my : {
        
        methods : {
            
            gatherReferences   : function (data) {
                
                var instance = new this.HOST()
                
                instance.visit(data)
                
                var uniqueRefs = []
                
                Joose.O.each(instance.references, function (value, ref) {
                    uniqueRefs.push(ref)
                })
                
                return uniqueRefs
            }
        }                    
    }
})
