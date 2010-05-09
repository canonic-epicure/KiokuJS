Class('JiojuDB.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'JiojuDB.Serializer.JSON', 'JiojuDB.Collapser.Inliner.JSPON' ],
    
    
    has : {
        serializer      : function () { return new JiojuDB.Serializer.JSON() }, 
        inliner         : Joose.I.FutureClass('JiojuDB.Collapser.Inliner.JSPON')
    },
    
        
    methods : {
        
        // XXX implement 'handles' for attributes
        serialize : function (entry) {
            return this.serializer.serialize(entry)
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
