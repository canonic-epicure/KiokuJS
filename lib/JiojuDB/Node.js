Class('JiojuDB.Node', {
    
    has : {
        
        ID          : null,
        
        object      : { required    : true },
        
        typeMap     : { required    : true },
        
        data        : { required    : true },
        
        firstClass  : false
    },
    

    methods : {
        
        getEntry   : function (firstClass) {
            
            var entry = {
                className       : this.typeMap.getClassNameFor(this.object),
                classVersion    : null,
                traits          : this.traits,
                
                data            : this.data
            }
            
            if (firstClass) {
                if (!this.firstClass) throw "Can't create first-class entry from second-class node : [" + this + ']'
                if (!this.ID) throw "Can't find id for first-class node : [" + this + ']'
                
                entry.ID = this.ID
            }
            
            return entry
        }
    }
})