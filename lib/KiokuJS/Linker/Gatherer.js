/**
 * This class visits the data structure and gathers the references to other nodes.
 * In some sense its the opposite of the inliner.
 */
 
Class('KiokuJS.Linker.Gatherer', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        references      : Joose.I.Object
    },    
    
    
    methods : {
        
        visitObject : function (object, className) {
            var ref = object.$ref
            
            if (ref) this.references[ ref ] = true
            
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
