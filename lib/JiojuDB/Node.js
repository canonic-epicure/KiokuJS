Class('JiojuDB.Node', {
    
    use : 'JiojuDB.Collapser.Inliner',
    
    
    has : {
        
        ID          : null,
        
        object      : { required    : true },
        className   : { required    : true },
        
        typeMap     : { required    : true },
        
        data        : { required    : true },
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        }
    },
    

    methods : {
        
        acquireID : function (desiredId) {
            var object = this.object
            
            if (object.__ID__) {
                
                if (object.__ID__ != desiredId) throw "Attempt to redefine the ID of [" + object + "] from [" + object.__ID__ + "] to [" + desiredId + "]"
                
                this.ID = object.__ID__
                
                return
            }
            
            
            this.ID = object.__ID__ = this.typeMap.acquireIDFor(object, desiredId)
        },
        
        
        buildEntry   : function () {
            
            var entry = {
                
                className       : this.className,
                
                // XXX extract version and traits
                classVersion    : null,
                traits          : null,
                
                data            : JiojuDB.Collapser.Inliner.visit(this.data)
            }
            
            if (this.ID) entry.ID = this.ID
            
            return entry
        }
    }
})