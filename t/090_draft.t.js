StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('JiojuDB', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
	
        
        var handler = new JiojuDB({
            
            backend     : new JiojuDB.Backend.CouchDB({
                url     : 'http://couchdb.org'
            }),
            
            
            resolver    : new JiojuDB.Resolver([
                {                                                          |   new JiojuDB.TypeMap.Naive({
                    meta        : 'JiojuDB.TypeMap.Naive',                 |       forClass    : 'Some.Class',
                                                                           |       
                    forClass    : 'Some.Class',                            |       inherit     : true,
                                                                           |       intrinsic   : true
                    inherit     : true,                                    |   }})
                    intrinsic   : true                                     |
                },
                
                {
                    meta        : 'JiojuDB.Resolver',
                    
                    items       : [
                        {
                            meta        : 'JiojuDB.TypeMap.Naive',
                            
                            forClass    : 'Some.Override'
                        },
                        
                        {
                            meta        : 'JiojuDB.Resolver',
                            
                            items       : [
                                {
                                    meta        : 'JiojuDB.TypeMap.Naive',
                                    
                                    forClass    : 'Some.Override'
                                },
                                {
                                    meta        : 'JiojuDB.TypeMap.Naive',
                                    
                                    forClass    : 'Yet.Another.Class'
                                }
                            ]
                        }
                    ]
                },
                
                
                {
                    'Some.Another.Class' : new JiojuDB.TypeMap.Callbacks({
                        
                        intrinsic : true,
                        
                        collapse : function () {
                            // do collapse
                        },
                    
                        expand : function () {
                            // do expand
                        }
                    })
                }
            ])
            
        })
        
        
        
        Class('Person', {
            does    : [ '...' ],
            traits  : [ '...' ],
            
            has : {
                name    : null,
                
                spouse  : {
                    isa : 'Person' //not yet implemeted in Joose 3
                }
            },
            
            methods : {
                //...
            }
        })
        
        
        var homer = new Person({
            name : 'Homer'
        })
        

        var marge   = new Person({
            name : 'Marge'
        })
        
        
        homer.spouse = marge
        marge.spouse = homer
        
        
        var homerId = handler.store({
            'homerId' : homer
        })
        

        //...
        
        
        var kindaHomer = handler.lookUp('homerId')
        
        kindaHomer === homer // true
        
        t.endAsync(async0)
    })
})    