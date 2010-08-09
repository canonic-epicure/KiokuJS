Class('KiokuJS.Test.Vertex', {
    
    has : {
        ID          : null,
        
        checkSum    : Joose.I.Array,
        
        ref0        : null,
        ref1        : null,
        ref2        : null,
        ref3        : null,
        ref4        : null,
        ref5        : null,
        ref6        : null,
        ref7        : null,
        ref8        : null,
        ref9        : null
    },
    
    
    methods : {
        
        initialize : function () {
            this.ID = this.my.ID++
        },
        
        
        addRef : function (object) {
            var index = this.checkSum.length
            
            
            this[ 'ref' + index ]   = object
            
            this.checkSum[ index ]  = object.ID
        },
        
        
        verifyIntegrity : function () {
            var ok = true
            
            Joose.A.each(this.checkSum, function (ID, index) {
                
                if (this[ 'ref' + index ].ID != ID) { 
                    ok = false
                    
                    return false
                }
                
            }, this)
            
            return ok
        }
    },
    
    
    my : {
        
        has : {
            ID      : 1,
            
            HOST    : null
        },
        
        
        methods : {
            
            createVertex : function (level, maxRefs) {
                
                var vertex      = new this.HOST()
                
                if (level) {
                
                    var refsNum     = 1 + Math.floor(Math.random() * maxRefs)
                    
                    for (var i = 1; i <= refsNum; i++) vertex.addRef(this.createVertex(level - 1, maxRefs))
                }
                
                return vertex
            },
            
            
            createGeneration : function (levels, maxRefs) {
                return this.createVertex(levels, maxRefs)
            }
        }
        
    }
})


