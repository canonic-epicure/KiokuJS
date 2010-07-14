Class('KiokuJS.Linker.Gatherer', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has : {
        references      : Joose.I.Object
    },    
    
    
    methods : {
        
        visitJooseInstance : function (object, className) {
            if (object instanceof KiokuJS.Reference) this.references[ object.ID ] = true
            
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
