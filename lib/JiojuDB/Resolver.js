Class('JiojuDB.Resolver', {
    
    
    has : {
        entries     : Joose.I.Array
    },
    
        
    methods : {
        
        compile : function () {
            throw "Abstract method 'compile' called for " + this
        }
    }

})
