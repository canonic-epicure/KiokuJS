StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.ValueWrapper', 'KiokuJS.Test.TypeMap.ValueWrapper' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,                   "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,         "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Test.ValueWrapper, "'KiokuJS.Test.ValueWrapper' is here")


        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var value = new KiokuJS.Test.ValueWrapper({ value : 'someValue' })
        
        var array = [ value, value ]
        
        var graph = {
            data1 : value,
            data2 : array
        }
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard([
                {
                    meta : 'KiokuJS.Test.TypeMap.ValueWrapper'
                }
            ])
        })
        
        var scope       = new KiokuJS.Scope({
            backend     : backend
        })
        
        var collapser = new KiokuJS.Collapser({
            scope       : scope
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ graph, array ])
        
        t.ok(nodes.length == 2, 'Correct number of nodes is returned')
        
        Joose.A.each(nodes, scope.pinNode, scope)
        
        //======================================================================================================================================================================================================================================================
        t.diag('Setting up nodes & entries')
        
        var graphNode           = scope.objectToNode(graph)
        var arrayNode           = scope.objectToNode(array)
        

        //======================================================================================================================================================================================================================================================
        t.diag('Decoding entries')
        
        var graphNode2          = backend.deserializeNode(backend.serializeNode(graphNode))
        var arrayNode2          = backend.deserializeNode(backend.serializeNode(arrayNode))
        
        var graphData2          = graphNode2.data
        var arrayData2          = arrayNode2.data
        
        var valueNode1          = graphData2.data1
        var valueNode2          = arrayData2[0]
        var valueNode3          = arrayData2[1]
        
        t.isaOk(valueNode1, KiokuJS.Node, 'Value node was correctly decoded into KiokuJS.Node instance #1')
        t.isaOk(valueNode2, KiokuJS.Node, 'Value node was correctly decoded into KiokuJS.Node instance #2')
        t.isaOk(valueNode3, KiokuJS.Node, 'Value node was correctly decoded into KiokuJS.Node instance #3')

        t.ok(valueNode1 != valueNode2 && valueNode2 != valueNode3, 'Value nodes are all different')
        
        t.ok(!valueNode1.isFirstClass(), 'Value nodes #1 is intrinsic')
        t.ok(!valueNode2.isFirstClass(), 'Value nodes #2 is intrinsic')
        t.ok(!valueNode3.isFirstClass(), 'Value nodes #3 is intrinsic')
        
        
        t.isaOk(graphData2.data2, KiokuJS.Reference, 'Correct class of `data2` in graphNode2')
        t.ok(graphData2.data2.ID == arrayNode2.ID, 'Correct reference to `arrayNode2` in `data2`')
        
        t.ok(valueNode1.data.value == 'someValue', 'Correct data in valueNode1')
        t.ok(valueNode2.data.value == 'someValue', 'Correct data in valueNode2')
        t.ok(valueNode3.data.value == 'someValue', 'Correct data in valueNode3')
        
        
        t.done()
        
        t.endAsync(async0)
    })
})    
