Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Serializer.JSON', 'KiokuJS.Collapser.Inliner.JSPON', 'KiokuJS.Linker.Outliner.JSPON' ],
    
    
    has : {
        serializer      : function () { return new KiokuJS.Serializer.JSON() }, 
        inliner         : Joose.I.FutureClass('KiokuJS.Collapser.Inliner.JSPON'), 
        outliner        : Joose.I.FutureClass('KiokuJS.Linker.Outliner.JSPON')
    },
    
        
    methods : {
        
        // XXX implement 'handles' for attributes
        serialize : function (entry) {
            return this.serializer.serialize(entry)
        },
        
        
        deserialize : function (serializedEntry) {
            return this.serializer.deserialize(serializedEntry)
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function () {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function () {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            remove  : function () {
                throw "Abstract method 'remove' called for " + this
            },
            
            
            exists  : function () {
                throw "Abstract method 'exists' called for " + this
            }
        }
    }

})
